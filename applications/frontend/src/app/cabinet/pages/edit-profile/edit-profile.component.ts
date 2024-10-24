import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TuiInputCountModule, TuiInputModule, TuiInputPasswordModule, TuiToggleModule} from "@taiga-ui/kit";
import {UserService} from "../../../shared/services/user.service";
import {take, takeWhile} from "rxjs";
import {TuiButtonModule} from "@taiga-ui/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {IUser} from "../../../shared/interfaces/IUser";
import {Router} from "@angular/router";

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputCountModule,
    TuiInputModule,
    TuiInputPasswordModule,
    TuiToggleModule,
    TuiButtonModule
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  alive = true;

  loading = false;
  error: string | null = null;
  prevIsCompany: boolean | null = null;

  user = inject(UserService)
  http = inject(HttpClient)
  cookie = inject(CookieService)
  router = inject(Router)

  constructor() {
    this.userForm = new FormGroup<any>({
      email: new FormControl(null, Validators.required),
      newPassword: new FormControl(null),
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      company: new FormControl<boolean>(false),
      companyInn: new FormControl(null),
      companyOgrn: new FormControl(null),
      companyKpp: new FormControl(null),
      companyAddress: new FormControl(null),
      companyName: new FormControl(null),
    })

    this.userForm.valueChanges
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => this.error = null)

    this.userForm.controls['company'].valueChanges
      .pipe(takeWhile(() => this.alive))
      .subscribe(state => {
        if (state === true) {
          this.userForm.controls['companyInn'].addValidators([Validators.required])
          this.userForm.controls['companyOgrn'].addValidators([Validators.required])
          this.userForm.controls['companyKpp'].addValidators([Validators.required])
          this.userForm.controls['companyAddress'].addValidators([Validators.required])
          this.userForm.controls['companyName'].addValidators([Validators.required])
        } else {
          this.userForm.patchValue({
            companyInn: null,
            companyOgrn: null,
            companyKpp: null,
            companyAddress: null,
            companyName: null,
          })
          this.userForm.controls['companyInn'].removeValidators([Validators.required])
          this.userForm.controls['companyOgrn'].removeValidators([Validators.required])
          this.userForm.controls['companyKpp'].removeValidators([Validators.required])
          this.userForm.controls['companyAddress'].removeValidators([Validators.required])
          this.userForm.controls['companyName'].removeValidators([Validators.required])
        }
        this.userForm.controls['companyInn'].updateValueAndValidity();
        this.userForm.controls['companyOgrn'].updateValueAndValidity();
        this.userForm.controls['companyKpp'].updateValueAndValidity();
        this.userForm.controls['companyAddress'].updateValueAndValidity();
        this.userForm.controls['companyName'].updateValueAndValidity();
      })
  }

  ngOnInit(): void {
    this.user.user$
      .pipe(takeWhile(() => this.alive))
      .subscribe(user => {
        if (user) {
          this.prevIsCompany = user.company
          this.userForm.patchValue({...user})
        }
      })
    }

  ngOnDestroy(): void {
        this.alive = false
    }


  editAccount() {
    this.loading = true;
    const token = this.cookie.get('authToken');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', token)
    const body = {
      email: this.userForm.value['email'],
      password: this.userForm.value['password'] ? this.userForm.value['password'] : null,
      firstName: this.userForm.value['firstName'],
      lastName: this.userForm.value['lastName'],
      companyInn: this.userForm.value['companyInn'],
      companyOgrn: this.userForm.value['companyOgrn'],
      companyKpp: this.userForm.value['companyKpp'],
      companyAddress: this.userForm.value['companyAddress'],
      companyName: this.userForm.value['companyName']
    }
    this.http.post<IUser>('http://localhost:3000/users/me', body, { headers: headers })
      .pipe(take(1))
      .subscribe({
        next: user => {
          this.user.setMe(user);
          this.router.navigateByUrl('/cabinet')
        },
        error: err => this.error = err.error.message
      })
  }
}
