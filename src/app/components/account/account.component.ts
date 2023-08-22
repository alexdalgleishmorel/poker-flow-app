import { Component, OnInit } from '@angular/core';
import { AuthService, Profile } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

  public profile?: Profile;

  constructor(
    private authService: AuthService
  ) {
    this.profile = authService.getCurrentUser();
  }

  ngOnInit() {}

  logout() {
    this.authService.doLogoutAndRedirectToLogin();
  }
}
