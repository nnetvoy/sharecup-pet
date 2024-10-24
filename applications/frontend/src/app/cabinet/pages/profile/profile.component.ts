import {Component, inject} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {TuiInputCountModule, TuiInputModule} from "@taiga-ui/kit";
import {TuiButtonModule} from "@taiga-ui/core";
import {PersonalDataComponent} from "./components/personal-data/personal-data.component";
import {CompanyCupsComponent} from "./components/company-cups/company-cups.component";
import {PrivateCodeComponent} from "./components/private-code/private-code.component";
import {UserService} from "../../../shared/services/user.service";
import {AsyncPipe} from "@angular/common";
import {CurrentSubscriptionComponent} from "./components/current-subscription/current-subscription.component";
import {SubscriptionService} from "../../../shared/services/subscription.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputCountModule,
    TuiInputModule,
    TuiButtonModule,
    PersonalDataComponent,
    CompanyCupsComponent,
    PrivateCodeComponent,
    AsyncPipe,
    CurrentSubscriptionComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  user = inject(UserService)
  subscription = inject(SubscriptionService)
}
