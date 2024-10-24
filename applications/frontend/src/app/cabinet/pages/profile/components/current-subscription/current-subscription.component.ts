import {Component, inject, Input, OnInit} from '@angular/core';
import {TuiButtonModule, TuiLoaderModule} from "@taiga-ui/core";
import {Router} from "@angular/router";
import {SubscriptionService} from "../../../../../shared/services/subscription.service";
import {AsyncPipe} from "@angular/common";
import {take} from "rxjs";

@Component({
  selector: 'app-current-subscription',
  standalone: true,
  imports: [
    TuiButtonModule,
    TuiLoaderModule,
    AsyncPipe
  ],
  templateUrl: './current-subscription.component.html',
  styleUrl: './current-subscription.component.scss'
})
export class CurrentSubscriptionComponent implements OnInit {
  loading = true;
  _router = inject(Router)
  _subscription = inject(SubscriptionService)

  async changeSubscription() {
    await this._router.navigateByUrl('cabinet/subscription')
  }

  ngOnInit(): void {
    this._subscription.getCurrentSubscription()
      .pipe(take(1))
      .subscribe(res => {
        this._subscription.setSubscription(res);
        this.loading = false;
      })
  }
}
