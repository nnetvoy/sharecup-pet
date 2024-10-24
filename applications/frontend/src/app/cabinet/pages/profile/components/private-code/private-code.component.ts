import {Component, inject, Input, OnInit} from '@angular/core';
import {TuiButtonModule} from "@taiga-ui/core";
import {NgxBarcode6Module} from "ngx-barcode6";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {take} from "rxjs";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-private-code',
  standalone: true,
  imports: [
    TuiButtonModule,
    NgxBarcode6Module,
    DatePipe
  ],
  templateUrl: './private-code.component.html',
  styleUrl: './private-code.component.scss'
})
export class PrivateCodeComponent implements OnInit {
  @Input({required: true}) id!: string;

  key: string | null = null;
  keyExpires: Date | null = null;
  loading = false;

  http = inject(HttpClient);
  cookie = inject(CookieService)

  ngOnInit() {
    this.getCurrentKey()
  }

  createNewKey() {
    this.loading = true;
    const token = this.cookie.get('authToken')
    let headers = new HttpHeaders()
    headers = headers.set('Authorization', token)
    this.http.get<any>('http://localhost:3000/private-key/new', { headers: headers })
      .pipe(take(1))
      .subscribe({
        next: key => {
          this.loading = false;
          this.key = key.key;
          this.keyExpires = this.calculateExpiryTime({createdAt: key.createdAt, lifeTimeSeconds: key.lifeTimeSeconds})
        },
        error: err => {
          this.loading = false;
        }
      })
  }

  getCurrentKey() {
    const token = this.cookie.get('authToken')
    let headers = new HttpHeaders()
    headers = headers.set('Authorization', token)
    this.http.get<any>('http://localhost:3000/private-key', { headers: headers })
      .pipe(take(1))
      .subscribe({
       next: key =>  {
         this.loading = false;
         this.key = key.key;
         this.keyExpires = this.calculateExpiryTime({createdAt: key.createdAt, lifeTimeSeconds: key.lifeTimeSeconds})
       },
      error: err => {
         this.loading = false;
      }
      })
  }

  calculateExpiryTime(data: { createdAt: string, lifeTimeSeconds: string }): Date {
    const createdAtDate = new Date(data.createdAt);
    const lifeTimeSeconds = parseInt(data.lifeTimeSeconds, 10);
    return new Date(createdAtDate.getTime() + lifeTimeSeconds * 1000);
  }
}
