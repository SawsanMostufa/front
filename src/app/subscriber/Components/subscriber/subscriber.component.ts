import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ISubscriber } from '../../Models/isubscriber';
import { SubscriberService } from '../../Service/subscriber.service';

@Component({
  selector: 'app-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrls: ['./subscriber.component.scss']
})
export class SubscriberComponent implements OnInit {
  addSubscriber!:FormGroup
  subscriberData:ISubscriber={} as ISubscriber;
  alert:boolean=false;

  constructor(private fb :FormBuilder,private subscriberService:SubscriberService,
    private route:Router) { }


  ngOnInit(): void {
    this.addSubscriber=this.fb.group({
      subscriberPhone:['',Validators.required] ,
      subscriberName:['',Validators.required] ,
      startDate:[Date.now,Validators.required] ,
      endDate:[Date.now,Validators.required] ,
      monthSubscribeType:['',Validators.required] ,

    })
  }
  get subscriberPhone() {
    return this.addSubscriber.controls['subscriberPhone'];
  }
  addSubscriberData()
  {
    this.subscriberData.name=this.addSubscriber.value.subscriberName;
    this.subscriberData.phoneNumber=this.addSubscriber.value.subscriberPhone;
        this.subscriberData.startDate=this.addSubscriber.value.startDate;
      this.subscriberData.endDate=this.addSubscriber.value.endDate;
    this.subscriberData.numberOfMail=this.addSubscriber.value.monthSubscribeType;
    if(this.addSubscriber.valid&&this.addSubscriber.value.startDate!=Date.now&& this.addSubscriber.value.endDate!=Date.now)
    {this.subscriberService.addNewSubscriber(this.subscriberData).subscribe((result)=>
      {})
          alert('تم إضافة مشترك بنجاح')
           window.location.reload()
      }
      else
      {
        alert("أدخل البيانات صحيحيه")
      }

}
}
