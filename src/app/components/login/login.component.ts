import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public hidePassword: boolean = true;

  constructor (
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private profileService: ProfileService,
    private router: Router
  ) {
    this.matIconRegistry.addSvgIcon(
      'google',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/google-icon.svg')
    );
  }

  ngOnInit(): void {
    this.profileService.setLoginPending(true);
  }

  login() {
    this.profileService.setLoginPending(false);
    this.profileService.setLoggedIn(true);
    this.router.navigate(['/', 'hub']);
  }
}
