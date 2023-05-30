import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  public loginPending: Subject<boolean> = new Subject<boolean>();
  public loggedIn: Subject<boolean>= new Subject<boolean>();

  private profile: Profile = {
    email: '',
    firstName: '',
    lastName: ''
  };

  constructor() {}

  setLoginPending(status: boolean) {
    this.loginPending.next(status)
  }

  setLoggedIn(status: boolean) {
    this.loggedIn.next(status);
  }

  logIn() {}

  logOut() {}

  getProfile(): Profile {
    return this.profile;
  }
}

export interface Profile {
  email: string;
  firstName: string;
  lastName: string;
}
