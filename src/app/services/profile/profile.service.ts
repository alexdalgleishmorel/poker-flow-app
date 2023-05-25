import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  public loginPending: Subject<boolean> = new Subject<boolean>();
  public loggedIn: Subject<boolean>= new Subject<boolean>();

  constructor(
  ) {}

  setLoginPending(status: boolean) {
    this.loginPending.next(status)
  }

  setLoggedIn(status: boolean) {
    this.loggedIn.next(status);
  }
}

export interface Profile {
  email: string;
  firstName: string;
  lastName: string;
}
