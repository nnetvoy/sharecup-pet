import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {CookieService} from "ngx-cookie-service";

export const isNotAuthorizatedGuard: CanActivateFn = (route, state) => {
  const cookie = inject(CookieService)
  const router = inject(Router)

  const authToken = cookie.get('authToken')

  if (authToken) {
    router.navigateByUrl('cabinet')
    return false
  } else {
    return true;
  }
};
