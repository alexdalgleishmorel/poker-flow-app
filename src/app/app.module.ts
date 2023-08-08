import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { NgModule } from '@angular/core';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor, AuthService } from './services/auth/auth.service';
import { HubComponent } from './components/hub/hub.component';
import { LoginComponent } from './components/login/login.component';
import { PoolService } from './services/pool/pool.service';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { ActiveGamesListComponent } from './components/active-games-list/active-games-list.component';
import { PastGamesListComponent } from './components/past-games-list/past-games-list.component';
import { UserPoolsTableComponent } from './components/user-pools-table/user-pools-table.component';

@NgModule({
  declarations: [
    AppComponent,
    ActiveGamesListComponent,
    HubComponent,
    LoginComponent,
    LoginFormComponent,
    PastGamesListComponent,
    SignupFormComponent,
    UserPoolsTableComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatTableModule,
    MatTabsModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    AuthService,
    PoolService,
    FormBuilder,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic'
      }
    },
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {
        showErrors: true
      }
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
