import { Component} from '@angular/core';
import { ProfileService } from 'src/app/services/profile/profile.service';
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
    private profileService: ProfileService,
    private router: Router
    ) {
    this.profileService.loginPending.subscribe((status) => {
      this.loginPending = status;
    });
    this.profileService.loggedIn.subscribe((status) => {
      this.loggedIn = status;
    });
  }

  login() {
    this.profileService.setLoginPending(true);
    this.router.navigate(['/', 'login']);
  }

  logout() {
    this.profileService.setLoginPending(false);
    this.profileService.setLoggedIn(false);
    this.goToWelcome();
  }

  goToWelcome() {
    this.profileService.setLoginPending(false);
    this.router.navigate(['/', 'welcome']);
  }
}
