import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IMealType } from '../Models/imeal-type';

@Injectable({
  providedIn: 'root'
})
export class MealTypesService {

  private httpOptions;
  constructor(private httpClient: HttpClient) {
    this.httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })

    }


  }

  getAllMealType():Observable<IMealType[]>
 {
  return this.httpClient.get<IMealType[]>(`${environment.BaseAPIURL}/Meals`)
 }

 addNewMealType(newMeal:IMealType):Observable<IMealType>
 {

return this.httpClient.post<IMealType>(`${environment.BaseAPIURL}/Meals`,JSON.stringify(newMeal),this.httpOptions);
 }
  
 getMealTypeById(mealTypeId:number):Observable<IMealType>
 {
  return this.httpClient.get<IMealType>(`${environment.BaseAPIURL}/Meals/${mealTypeId}`)
 }

}
