import { Injectable, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { HubComponent } from './components/hub/hub.component';
import { LoginComponent } from './components/login/login.component';
import { PoolComponent } from './components/pool/pool.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AuthService } from './services/auth/auth.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppGuard {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn$.pipe(
      tap((isLoggedIn) => {
        if (!isLoggedIn) this.router.navigate(['/login']);
      })
    );
  }
}

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'hub', component: HubComponent, canActivate: [AppGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'pool/:id', component: PoolComponent },
  { path: 'welcome', component: WelcomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
