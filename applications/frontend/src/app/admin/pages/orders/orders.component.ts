import {Component, inject, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {take} from "rxjs";
import {TuiLoaderModule} from "@taiga-ui/core";
import {IExchange} from "./interfaces/IExchange";

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    TuiLoaderModule
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  loading = false;

  httpService = inject(HttpClient)
  cookieService = inject(CookieService)

  changes: IExchange[] = [];

  ngOnInit(): void {
    this.getStatistic();
  }

  getStatistic() {
    this.loading = true;
    const token = this.cookieService.get('authToken')
    let headers: HttpHeaders = new HttpHeaders()
    headers = headers.set('Authorization', token)

    this.httpService.get<IExchange[]>('http://localhost:3000/subscription/cups/admin', {headers: headers})
      .pipe(take(1))
      .subscribe(res => {
        this.loading = false;
        this.changes = res;
      })
  }
}
