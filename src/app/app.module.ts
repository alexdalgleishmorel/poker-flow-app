import { NgModule } from '@angular/core';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor, AuthService } from './services/auth/auth.service';
import { HubComponent } from './components/hub/hub.component';
import { LoginComponent } from './components/login/login.component';
import { PoolService } from './services/pool/pool.service';
import { LoginFormComponent } from './components/login/login-form/login-form.component';
import { SignupFormComponent } from './components/login/signup-form/signup-form.component';
import { GamesListComponent } from './components/hub/games-list/games-list.component';
import { UserPoolsTableComponent } from './components/hub/games-list/user-pools-table/user-pools-table.component';
import { PoolComponent } from './components/pool/pool.component';
import { ChartContainerComponent } from './components/pool/chart-container/chart-container.component';
import { DonutChartComponent } from './components/pool/chart-container/donut-chart/donut-chart.component';
import { ActivityTableComponent } from './components/pool/activity-container/activity-table/activity-table.component';
import { ActivityContainerComponent } from './components/pool/activity-container/activity-container.component';
import { GameSettingsComponent } from './components/pool/settings/settings.component';
import { ChipViewComponent } from './components/common/chip-view/chip-view.component';
import { ThousandSuffixesPipe } from './app.component';
import { LoadingSpinnerComponent } from './components/common/loading-spinner/loading-spinner.component';
import { ChipSelectComponent } from './components/common/chip-select/chip-select.component';
import { CreateGameModalComponent } from './components/hub/create-game-modal/create-game-modal.component';
import { BuyInModalComponent } from './components/pool/buy-in-modal/buy-in-modal.component';
import { AccountComponent } from './components/account/account.component';
import { ShareGameComponent } from './components/pool/share/share.component';
import { ChipDepositModalComponent } from './components/pool/chip-deposit-modal/chip-deposit-modal.component';
import { JoinGameModalComponent } from './components/hub/join-game-modal/join-game-modal.component';
import { BASE_URL } from './services/api/api.service';

const config: SocketIoConfig = { url: BASE_URL, options: {transports: ['websocket'], reconnection: true}};

@NgModule({
  declarations: [
    AccountComponent,
    AppComponent,
    GamesListComponent,
    BuyInModalComponent,
    ChipDepositModalComponent,
    ChipViewComponent,
    ChipSelectComponent,
    CreateGameModalComponent,
    HubComponent,
    JoinGameModalComponent,
    LoadingSpinnerComponent,
    LoginComponent,
    LoginFormComponent,
    ActivityContainerComponent,
    ActivityTableComponent,
    PoolComponent,
    ChartContainerComponent,
    DonutChartComponent,
    GameSettingsComponent,
    ShareGameComponent,
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
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
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
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
