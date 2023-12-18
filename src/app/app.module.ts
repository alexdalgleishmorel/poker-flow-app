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
import { ChipSelectComponent } from './components/chip-select/chip-select.component';
import { CreateGameModalComponent } from './components/create-game-modal/create-game-modal.component';
import { PasswordModalComponent } from './components/common/password-modal/password-modal.component';
import { BuyInModalComponent } from './components/buy-in-modal/buy-in-modal.component';
import { TransactionCancelledModalComponent } from './components/common/transaction-cancelled-modal/transaction-cancelled-modal.component';
import { AccountComponent } from './components/account/account.component';
import { StatsComponent } from './components/stats/stats.component';
import { SharePoolComponent } from './components/share-pool/share-pool.component';
import { ChipDepositModalComponent } from './components/chip-deposit-modal/chip-deposit-modal.component';
import { JoinGameModalComponent } from './components/join-game-modal/join-game-modal.component';
import { BASE_URL } from './services/api/api.service';

const config: SocketIoConfig = { url: BASE_URL, options: {transports: ['websocket'], reconnection: true}};

@NgModule({
  declarations: [
    AccountComponent,
    AppComponent,
    ActiveGamesListComponent,
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
    PasswordModalComponent,
    PastGamesListComponent,
    PoolActivityContainerComponent,
    PoolActivityTableComponent,
    PoolComponent,
    PoolChartContainerComponent,
    PoolDonutChartComponent,
    PoolSettingsComponent,
    SharePoolComponent,
    SignupFormComponent,
    StatsComponent,
    ThousandSuffixesPipe,
    TransactionCancelledModalComponent,
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
