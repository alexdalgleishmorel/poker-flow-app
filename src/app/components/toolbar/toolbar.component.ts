import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  public spinnerColor: ThemePalette = 'accent';
  public loginPending: boolean = false;
  public loggedIn: boolean = false;

  constructor (
    private router: Router
    ) {}

  login() {
    this.router.navigate(['/', 'login']);
  }

  logout() {
    this.goToWelcome();
  }

  goToWelcome() {
    this.router.navigate(['/', 'welcome']);
  }
}
