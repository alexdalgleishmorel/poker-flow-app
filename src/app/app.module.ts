import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { NgModule } from '@angular/core';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
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
import { PoolComponent } from './components/pool/pool.component';
import { PoolChartContainerComponent } from './components/pool-chart-container/pool-chart-container.component';
import { PoolDonutChartComponent } from './components/pool-donut-chart/pool-donut-chart.component';
import { PoolActivityTableComponent } from './components/pool-activity-table/pool-activity-table.component';
import { PoolActivityContainerComponent } from './components/pool-activity-container/pool-activity-container.component';
import { PoolSettingsComponent } from './components/pool-settings/pool-settings.component';
import { ChipViewComponent, ThousandSuffixesPipe } from './components/chip-view/chip-view.component';
import { LoadingSpinnerComponent } from './components/common/loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    ActiveGamesListComponent,
    ChipViewComponent,
    HubComponent,
    LoadingSpinnerComponent,
    LoginComponent,
    LoginFormComponent,
    PastGamesListComponent,
    PoolActivityContainerComponent,
    PoolActivityTableComponent,
    PoolComponent,
    PoolChartContainerComponent,
    PoolDonutChartComponent,
    PoolSettingsComponent,
    SignupFormComponent,
    ThousandSuffixesPipe,
    UserPoolsTableComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatStepperModule,
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
