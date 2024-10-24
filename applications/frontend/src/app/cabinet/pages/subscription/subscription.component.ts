import {Component, inject} from '@angular/core';
import {TuiButtonModule} from "@taiga-ui/core";
import {UserService} from "../../../shared/services/user.service";
import {AsyncPipe} from "@angular/common";
import {SubscriptionService} from "../../../shared/services/subscription.service";
import {take} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [
    TuiButtonModule,
    AsyncPipe
  ],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent {

  loading: 'privateBaseMonth' | 'privateBaseYear' | 'privateStudentMonth' | 'privateStudentYear' | 'companyBaseMonth' |
    'companyBaseYear' | 'companyPremiumMonth' | 'companyPremiumYear' | null | any = null

  userService = inject(UserService)
  subscriptionService = inject(SubscriptionService)
  router = inject(Router)

  setSubscription(type: 'privateBase' | 'privateStudent'| 'companyBase' | 'companyPremium', period: 'month' | 'year') {
    this.loading = (type + this.capitalizeFirstLetter(period)) as string
    this.subscriptionService.createNewSubscription(type, period)
      .pipe(take(1))
      .subscribe(res => {
        this.loading = null;
        this.subscriptionService.setSubscription(res);
        this.router.navigateByUrl('/cabinet')
      })
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

}
