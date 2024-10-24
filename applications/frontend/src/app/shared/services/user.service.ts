import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {IUser} from "../interfaces/IUser";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public authToken: null | string = null;

  private user: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(null)
  user$ = this.user.asObservable();

  constructor(private http: HttpClient, private cookie: CookieService) { }

  getMe(): Observable<IUser> {
    const token = this.cookie.get('authToken')
    let headers: HttpHeaders = new HttpHeaders()
    headers = headers.set('Authorization', token)
    return this.http.get<IUser>('http://localhost:3000/users/me', {headers: headers})
  }

  clearMe() {
    this.user.next(null)
  }

  setMe(user: IUser) {
    this.user.next(user)
  }

}
