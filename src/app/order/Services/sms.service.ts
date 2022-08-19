import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SMS } from '../Models/sms';

@Injectable({
  providedIn: 'root'
})
export class SMSService {
 private httpOptions;
  constructor(private httpClient:HttpClient) { 
    this.httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })

    }
  }
  sendSMS(sms:SMS):Observable<SMS>
 {

return this.httpClient.post<SMS>(`${environment.BaseAPIURL}/SMS/send`,JSON.stringify(sms),this.httpOptions);
 }

}
