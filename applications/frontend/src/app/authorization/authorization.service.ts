import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IRegisterUser} from "../shared/interfaces/IRegisterUser";
import {CookieService} from "ngx-cookie-service";
import {UserService} from "../shared/services/user.service";
import {SubscriptionService} from "../shared/services/subscription.service";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private http: HttpClient, private cookie: CookieService, private user: UserService, private subscription: SubscriptionService) { }

  loginUser(data: {email: string, password: string}) {
    return this.http.post('http://localhost:3000/auth', data)
  }

  registerUser(data: IRegisterUser) {
    return this.http.post('http://localhost:3000/auth/registration', data)
  }

  logoutUser() {
    this.cookie.delete('authToken');
    this.user.clearMe();
    this.subscription.clearSubscription();
  }

}
