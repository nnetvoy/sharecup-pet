import {Component, inject, Input} from '@angular/core';
import {TuiButtonModule} from "@taiga-ui/core";
import {Router} from "@angular/router";
import {IUser} from "../../../../../shared/interfaces/IUser";

@Component({
  selector: 'app-personal-data',
  standalone: true,
    imports: [
        TuiButtonModule
    ],
  templateUrl: './personal-data.component.html',
  styleUrl: './personal-data.component.scss'
})
export class PersonalDataComponent {
  @Input({required: true}) user!: IUser

  _router = inject(Router)

  async editAccount() {
    await this._router.navigateByUrl('cabinet/edit')
  }
}
