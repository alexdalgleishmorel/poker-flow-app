import { Injectable, NgModule } from '@angular/core';
import { PreloadAllModules, Router, RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { Observable, tap } from 'rxjs';
import { AuthService } from './services/auth/auth.service';
import { LoginFormComponent } from './components/login/login-form/login-form.component';
import { SignupFormComponent } from './components/login/signup-form/signup-form.component';

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
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AppGuard],
  },
  { 
    path: 'login', 
    component: LoginComponent,
    children: [
      {
        path: '',
        redirectTo: '/login/signin',
        pathMatch: 'full'
      },
      {
        path: 'signin',
        component: LoginFormComponent
      },
      {
        path: 'signup',
        component: SignupFormComponent
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
