import {Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {UserService} from "../../../shared/services/user.service";
import {TuiButtonModule} from "@taiga-ui/core";
import {AuthorizationService} from "../../../authorization/authorization.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    NgOptimizedImage,
    AsyncPipe,
    TuiButtonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  user = inject(UserService)
  auth = inject(AuthorizationService)
  router = inject(Router)

  logout() {
    this.auth.logoutUser()
    this.router.navigateByUrl('/')
  }
}
