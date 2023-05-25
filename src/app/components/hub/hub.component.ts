import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.scss']
})
export class HubComponent {
  public deviceConnected: boolean = false;

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) {}

  joinGame() {
    this.router.navigate(['/', 'pool']);
  }

  newGame() {}

  connectToDevice() {}
}
