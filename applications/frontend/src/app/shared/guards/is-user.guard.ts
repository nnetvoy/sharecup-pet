import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {UserService} from "../services/user.service";
import {catchError, map, of} from "rxjs";

export const isUserGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router)

  return userService.getMe().pipe(
    map(user => {
      userService.setMe(user)
      if (!user.isAdmin) {
        return true;
      } else {
        router.navigate(['/admin']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/auth']);
      return of(false);
    })
  );


};
