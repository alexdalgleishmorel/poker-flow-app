import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { LoginComponent } from './components/login/login.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthInterceptor, AuthService } from './services/auth/auth.service';
import { PoolService } from './services/pool/pool.service';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { HubComponent } from './components/hub/hub.component';
import { PoolComponent } from './components/pool/pool.component';
import { PoolDonutChartComponent } from './components/pool-donut-chart/pool-donut-chart.component';
import { SearchDeviceModalComponent } from './components/search-device-modal/search-device-modal.component';
import { CreateGameModalComponent } from './components/create-game-modal/create-game-modal.component';
import { ConnectDeviceModalComponent } from './components/connect-device-modal/connect-device-modal.component';
import { BuyInModalComponent } from './components/buy-in-modal/buy-in-modal.component';
import { ChipDepositModalComponent } from './components/chip-deposit-modal/chip-deposit-modal.component';
import { UserPoolsTableComponent } from './components/user-pools-table/user-pools-table.component';
import { PoolActivityTableComponent } from './components/pool-activity-table/pool-activity-table.component';
import { JoinNewGameModalComponent } from './components/join-new-game-modal/join-new-game-modal.component';
import { ChipWithdrawalModalComponent } from './components/chip-withdrawal-modal/chip-withdrawal-modal.component';
import { PasswordModalComponent } from './components/password-modal/password-modal.component';
import { ChipViewComponent } from './components/chip-view/chip-view.component';
import { ChipSelectComponent, ThousandSuffixesPipe } from './components/chip-select/chip-select.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ToolbarComponent,
    WelcomeComponent,
    HubComponent,
    PoolComponent,
    PoolDonutChartComponent,
    SearchDeviceModalComponent,
    CreateGameModalComponent,
    ConnectDeviceModalComponent,
    BuyInModalComponent,
    ChipDepositModalComponent,
    UserPoolsTableComponent,
    PoolActivityTableComponent,
    JoinNewGameModalComponent,
    ChipWithdrawalModalComponent,
    PasswordModalComponent,
    ChipViewComponent,
    ChipSelectComponent,
    ThousandSuffixesPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
