import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';
import { AuthService } from 'src/app/services/auth/auth.service';

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
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.isLoggedIn$.subscribe((loggedIn: boolean) => this.loggedIn = loggedIn);
  }

  goToLogin() {
    this.router.navigate(['/', 'login']);
  }

  logout() {
    this.authService.doLogoutUser();
    this.goToWelcome();
  }

  goToWelcome() {
    this.router.navigate(['/', 'welcome']);
  }
}
