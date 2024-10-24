import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import {TuiRootModule, TuiDialogModule, TuiAlertModule, TUI_SANITIZER, TuiThemeNightModule} from "@taiga-ui/core";
import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "./static/components/header/header.component";
import {FooterComponent} from "./static/components/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TuiRootModule, TuiDialogModule, TuiAlertModule, HeaderComponent, FooterComponent, TuiThemeNightModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
    providers: [{provide: TUI_SANITIZER, useClass: NgDompurifySanitizer}]
})
export class AppComponent {
}
