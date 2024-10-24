import {Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TuiInputModule, TuiInputPasswordModule, TuiToggleModule} from "@taiga-ui/kit";
import {AuthorizationService} from "../../authorization.service";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {take, takeWhile} from "rxjs";
import {TuiButtonModule} from "@taiga-ui/core";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputPasswordModule,
    TuiToggleModule,
    TuiButtonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnDestroy {
  registerForm!: FormGroup;

  alive = true;
  error: string | null = null;

  loading = false;

  constructor(private auth: AuthorizationService, private cookie: CookieService, private router: Router) {
    this.registerForm = new FormGroup<any>({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      company: new FormControl<boolean>(false, Validators.required),
      companyInn: new FormControl(null),
      companyOgrn: new FormControl(null),
      companyKpp: new FormControl(null),
      companyAddress: new FormControl(null),
      companyName: new FormControl(null),
    })

    this.registerForm.valueChanges.subscribe(() => {
      this.error = null;
    })

    this.registerForm.controls['company'].valueChanges
      .pipe(takeWhile(() => this.alive))
      .subscribe(state => {
        if (state === true) {
          this.registerForm.controls['companyInn'].addValidators([Validators.required])
          this.registerForm.controls['companyOgrn'].addValidators([Validators.required])
          this.registerForm.controls['companyKpp'].addValidators([Validators.required])
          this.registerForm.controls['companyAddress'].addValidators([Validators.required])
          this.registerForm.controls['companyName'].addValidators([Validators.required])
        } else {
          this.registerForm.patchValue({
            companyInn: null,
            companyOgrn: null,
            companyKpp: null,
            companyAddress: null,
            companyName: null,
          })
          this.registerForm.controls['companyInn'].removeValidators([Validators.required])
          this.registerForm.controls['companyOgrn'].removeValidators([Validators.required])
          this.registerForm.controls['companyKpp'].removeValidators([Validators.required])
          this.registerForm.controls['companyAddress'].removeValidators([Validators.required])
          this.registerForm.controls['companyName'].removeValidators([Validators.required])
        }
        this.registerForm.controls['companyInn'].updateValueAndValidity();
        this.registerForm.controls['companyOgrn'].updateValueAndValidity();
        this.registerForm.controls['companyKpp'].updateValueAndValidity();
        this.registerForm.controls['companyAddress'].updateValueAndValidity();
        this.registerForm.controls['companyName'].updateValueAndValidity();
      })
  }

  register() {
    this.error = null;
    this.loading = true;
    this.auth.registerUser(this.registerForm.value)
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
