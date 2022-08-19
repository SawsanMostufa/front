import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ISubscriber } from 'src/app/subscriber/Models/isubscriber';
import { SubscriberService } from 'src/app/subscriber/Service/subscriber.service';
import { IAdditionalMeal } from '../../Models/iadditional-meal';
import { IMealType } from '../../Models/imeal-type';
import { IOrder } from '../../Models/iorder';
import { SMS } from '../../Models/sms';
import { OrderService } from '../../Services/order.service';
import { SMSService } from '../../Services/sms.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  mealsTypeList: IMealType[] = [];
  additionsList: IAdditionalMeal[] = [];
  selectedMeals: IMealType[] = [];
  allLastQuantity: number = 0;
  MealsTypeDropdownList: IDropdownSettings = {};
  AddtionsDropdownList: IDropdownSettings = {};
  subscribeType: number = 0;
  orderData!: FormGroup;
  sms:SMS= {} as SMS;
  newOrder: IOrder = {} as IOrder;
  remainingQuantity: number = 0;
  allSubscribers: ISubscriber[] = [];
  currentSubscriber: any; //ISubscriber={} as ISubscriber
  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private subscriberService: SubscriberService,
    private smsService: SMSService,

  ) {}
  mealTypesList: IMealType[] = [];
  otherAddtionsList: any = [];
  mealTypeListForBack: any = [];
  mealsQuantities: number = 0;
  ngOnInit(): void {
    this.mealTypesList = [
      { id: 1, name: 'لحم', quantityMealType: 0 },
      { id: 2, name: 'دجاج', quantityMealType: 0 },
      { id: 3, name: 'سمك', quantityMealType: 0 },
      { id: 4, name: 'الإفطار', quantityMealType: 0 },
    ];

    this.additionsList = [
      { id: 1, mealName: 'مشروبات' },
      { id: 2, mealName: 'سناك' },
      { id: 3, mealName: 'سلطات' },
      { id: 4, mealName: ' زيادة كارب ٥٠ جرام' },
      { id: 5, mealName: ' لا توجد اضافات' },
    ];
    this.AddtionsDropdownList = {
      idField: 'id',
      textField: 'mealName',
      enableCheckAll: false,
    };
    this.orderData = this.fb.group({
      quantity: ['', Validators.required],
      orderDate: ['', Validators.required],
      otherAdditons: ['', [Validators.required]],
      phone: ['', [Validators.required]],
    });
  }

  getSelectedAdditions(ids: any) {
    return this.additionsList.filter((item) => ids.includes(item.id));
  }
  get phone() {
    return this.orderData.controls['phone'];
  }

  addOrder() {
    let counter = 0;
    this.mealsQuantities = 0;
    if (this.orderData.value.phone != '' && this.orderData.valid) {
      this.subscriberService
        .geSubscriberbyPhoneNumber(this.orderData.value.phone)
        .subscribe((result: any) => {
          if (result != null) {
            this.currentSubscriber = result;
          } else {
            alert('رقم الجوال غير موجود');
          }
          this.subscribeType = this.currentSubscriber.numberOfMail;
          this.newOrder.quantity = this.orderData.value.quantity;
          this.newOrder.orderDate = this.orderData.value.orderDate;
          this.newOrder.other_meals = this.getSelectedAdditions(
            this.orderData.value.otherAdditons.map(
              (item: IAdditionalMeal) => item.id
            )
          );

          for (let index = 0; index < this.mealTypesList.length; index++) {
            if (this.mealTypesList[index].quantityMealType != 0) {
              counter++;
              this.mealsQuantities +=
                this.mealTypesList[index].quantityMealType;
            }
            this.mealTypeListForBack.push({
              name: this.mealTypesList[index].name,
              quantityMealType: this.mealTypesList[index].quantityMealType,
            });
          }

          let finalMealListForBack: any = [];
          let sum = 0;
          for (
            let index = this.mealTypeListForBack.length - 1;
            index >= 0;
            index--
          ) {
            if (this.mealTypeListForBack[index].quantityMealType != 0) {
              finalMealListForBack.push(this.mealTypeListForBack[index]);
            }
            sum += this.mealTypeListForBack[index].quantityMealType;
            if (sum == this.newOrder.quantity) {
              break;
            }
          }

          for (
            let index = 0;
            index < this.newOrder.other_meals.length;
            index++
          ) {
            if (this.newOrder.quantity == this.mealsQuantities) {
              this.otherAddtionsList.push({
                mealName: this.newOrder.other_meals[index].mealName,
              });
            }
          }
          if (this.newOrder.quantity == this.mealsQuantities) {
            //___________(MealTyps)___________________
            this.newOrder.mealTypes = finalMealListForBack;
            this.newOrder.other_meals = this.otherAddtionsList;
          } else {
            alert('العدد المسحوب اكبر من عدد الوجبات المحدد');
          }

          if (this.newOrder.quantity == this.mealsQuantities) {
            if (
              this.currentSubscriber.remainingQuantity >= this.mealsQuantities
            ) {
              this.orderService
                .addNewOrderWithinSubscriberId(
                  this.newOrder,
                  this.currentSubscriber.id
                )
                .subscribe((result: any) => {
                  this.remainingQuantity = result;
                  alert('تم السحب بنجاح');
                  window.location.reload();
                  this.sms.mobileNumber=this.orderData.value.phone;
                  this.sms.body="كمية الوجبات المتبقيه لديك "+this.remainingQuantity
                  this.smsService.sendSMS(this.sms).subscribe(result=>{
                    console.log(result);
                  })
                });
            } else {
              alert('الكميه المسحوبه اكبر من الكميه المتبقيه فى حسابك');
            }
          } else {
            alert('يجب تحديد نوع الوجبات المسحوبه');
          }
        });
    } else {
      alert(' ادخل البيانات صحيحة وكاملة');
    }
  }

}
