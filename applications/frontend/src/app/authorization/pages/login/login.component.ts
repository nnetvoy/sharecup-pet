import {Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TuiInputModule, TuiInputPasswordModule} from "@taiga-ui/kit";
import {AuthorizationService} from "../../authorization.service";
import {take, takeWhile} from "rxjs";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {TuiButtonModule} from "@taiga-ui/core";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputPasswordModule,
    TuiButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy {
  loginForm!: FormGroup;

  alive = true;
  error: string | null = null;

  loading = false;

  constructor(private auth: AuthorizationService, private cookie: CookieService, private router: Router) {
    this.loginForm = new FormGroup<any>({
      email: new FormControl(null),
      password: new FormControl(null)
    })

    this.loginForm
      .valueChanges
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => {
        this.error = null
      })

  }


  login() {
    this.error = null;
    this.loading = true;
    this.auth.loginUser(this.loginForm.value)
      .pipe(take(1))
      .subscribe({
        next: (value) => {
          const token = value as string;
          this.cookie.set('authToken', token, this.add24HoursAndOutputJSON())
          this.router.navigateByUrl('cabinet')
        },
        error: err => {
          this.error = err.error.message;
          this.loading = false;
        }
      })
  }

  ngOnDestroy() {
    this.alive = false;
  }

  add24HoursAndOutputJSON() {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 24);
    return currentDate
  }


}
