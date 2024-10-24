import {Component, inject, Input, OnInit} from '@angular/core';
import {TuiButtonModule, TuiLoaderModule} from "@taiga-ui/core";
import {TuiInputDateModule, TuiInputModule} from "@taiga-ui/kit";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {IUser} from "../../../../../shared/interfaces/IUser";
import {CookieService} from "ngx-cookie-service";
import {take} from "rxjs";
import {IStatistic} from "./interfaces/IStatistic";

@Component({
  selector: 'app-company-cups',
  standalone: true,
  imports: [
    TuiButtonModule,
    TuiInputDateModule,
    TuiInputModule,
    ReactiveFormsModule,
    TuiLoaderModule
  ],
  templateUrl: './company-cups.component.html',
  styleUrl: './company-cups.component.scss'
})
export class CompanyCupsComponent implements OnInit {
  @Input({required: true}) id!: string;

  // Работа с клиентом

  errorGiveUserCup: string | null = null;
  successGiveUserCup: string | null = null;

  errorTakeUserCup: string | null = null;
  successTakeUserCup: string | null = null;

  loadingGiveUserCup = false;
  loadingTakeUserCup = false;

  giveUserCupControl: FormControl = new FormControl<number | null>(null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)])
  takeUserCupControl: FormControl = new FormControl<number | null>(null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)])

  // Работа баристы с кружками

  errorOrderCup: string | null = null;
  successOrderCup: string | null = null;

  errorReturnCup: string | null = null;
  successReturnCup: string | null = null;

  loadingOrderCup = false;
  loadingReturnCup = false;

  orderCupControl: FormControl = new FormControl<number | null>(null, [Validators.required])
  returnCupControl: FormControl = new FormControl<number | null>(null, [Validators.required])

  loadingStatistic = false;

  httpService = inject(HttpClient)
  cookieService = inject(CookieService)

  statistic: IStatistic[] = []

  ngOnInit() {
    this.getStatistic()
  }


  giveUserCup() {
    this.errorGiveUserCup = null;
    this.successGiveUserCup = null;
    this.loadingGiveUserCup = true;
    const token = this.cookieService.get('authToken')
    let headers: HttpHeaders = new HttpHeaders()
    headers = headers.set('Authorization', token)
    return this.httpService.patch<IUser>('http://localhost:3000/subscription/cups/private', {
      key: this.giveUserCupControl.value,
      type: 'order'
    }, {headers: headers})
      .pipe(take(1))
      .subscribe({
        next: value => {
          this.successGiveUserCup = 'Пользователю успешно передан стакан';
          this.loadingGiveUserCup = false;
          this.giveUserCupControl.reset();
        },
        error: err => {
          this.errorGiveUserCup = err.error.message;
          this.loadingGiveUserCup = false;
        }
      })
  }

  takeUserCup() {
    this.errorTakeUserCup = null;
    this.successTakeUserCup = null;
    this.loadingTakeUserCup = true;
    const token = this.cookieService.get('authToken')
    let headers: HttpHeaders = new HttpHeaders()
    headers = headers.set('Authorization', token)
    return this.httpService.patch<IUser>('http://localhost:3000/subscription/cups/private', {
        key: this.takeUserCupControl.value,
        type: 'return'
      }, {headers: headers})
      .pipe(take(1))
      .subscribe({
        next: value => {
          this.successTakeUserCup = 'С пользователя успешно списан стакан';
          this.loadingTakeUserCup = false;
          this.takeUserCupControl.reset();
        },
        error: err => {
          this.errorTakeUserCup = err.error.message;
          this.loadingTakeUserCup = false;
        }
      })
  }

  orderCups() {
    this.loadingOrderCup = true;
    this.errorOrderCup = null
    this.successOrderCup = null;

    const token = this.cookieService.get('authToken')
    let headers: HttpHeaders = new HttpHeaders()
    headers = headers.set('Authorization', token)

    this.httpService.patch<IStatistic>('http://localhost:3000/subscription/cups/company', {
      amount: this.orderCupControl.value,
      type: 'order'
    }, { headers: headers })
      .pipe(take(1))
      .subscribe({
        next: (value: IStatistic) => {
          this.statistic.push(value)
          this.loadingOrderCup = false;
          this.successOrderCup = 'Стаканы успешно получены'
        },
        error: err => {
          this.loadingOrderCup = false;
          this.errorOrderCup = err.error.message;
        }
      })
  }

  returnCups() {
    this.loadingReturnCup = true;
    this.errorReturnCup = null
    this.successReturnCup = null;

    const token = this.cookieService.get('authToken')
    let headers: HttpHeaders = new HttpHeaders()
    headers = headers.set('Authorization', token)

    this.httpService.patch<IStatistic>('http://localhost:3000/subscription/cups/company', {
      amount: this.returnCupControl.value,
      type: 'return'
    }, { headers: headers })
      .pipe(take(1))
      .subscribe({
        next: value => {
          this.statistic.push(value);
          this.loadingReturnCup = false;
          this.successReturnCup = 'Стаканы успешно сданы'
        },
        error: err => {
          this.loadingReturnCup = false;
          this.errorReturnCup = err.error.message;
        }
      })
  }

  getStatistic() {
    const token = this.cookieService.get('authToken')
    let headers: HttpHeaders = new HttpHeaders()
    headers = headers.set('Authorization', token)

    this.loadingStatistic = true;
    this.httpService.get<IStatistic[]>('http://localhost:3000/subscription/cups/company/statistic', {headers: headers})
      .pipe(take(1))
      .subscribe(statistic => {
        this.statistic = statistic
        this.loadingStatistic = false;
      })

  }

}
