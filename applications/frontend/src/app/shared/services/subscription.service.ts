import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {IUser} from "../interfaces/IUser";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {ISubscription} from "../interfaces/ISubscription";

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private subscription: BehaviorSubject<ISubscription | null> = new BehaviorSubject<ISubscription | null>(null)
  subscription$ = this.subscription.asObservable();

  constructor(private http: HttpClient, private cookie: CookieService) { }

  getCurrentSubscription(): Observable<ISubscription> {
    const token = this.cookie.get('authToken')
    let headers: HttpHeaders = new HttpHeaders()
    headers = headers.set('Authorization', token)
    return this.http.get<ISubscription>('http://localhost:3000/subscription/current', {headers: headers})
  }

  createNewSubscription(type: 'privateBase' | 'privateStudent'| 'companyBase' | 'companyPremium', period: 'month' | 'year') {
    const token = this.cookie.get('authToken')
    let headers: HttpHeaders = new HttpHeaders()
    headers = headers.set('Authorization', token)
    return this.http.post<ISubscription>('http://localhost:3000/subscription/new',  {type: type, period: period},{headers: headers})
  }

  clearSubscription() {
    this.subscription.next(null)
  }

  setSubscription(subscription: ISubscription) {
    this.subscription.next(subscription)
  }

}
