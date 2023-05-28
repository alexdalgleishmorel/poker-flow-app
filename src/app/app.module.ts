import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from "@angular/common/http";
import { LoginComponent } from './components/login/login.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PoolService } from './services/pool/pool.service';
import { ProfileService } from './services/profile/profile.service';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { HubComponent } from './components/hub/hub.component';
import { PoolComponent } from './components/pool/pool.component';
import { PoolDonutChartComponent } from './components/pool-donut-chart/pool-donut-chart.component';
import { SearchDeviceModalComponent } from './components/search-device-modal/search-device-modal.component';
import { CreateGameModalComponent } from './components/create-game-modal/create-game-modal.component';
import { ConnectDeviceModalComponent } from './components/connect-device-modal/connect-device-modal.component';
import { BuyInModalComponent } from './components/buy-in-modal/buy-in-modal.component';

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
    BuyInModalComponent
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
    MatProgressSpinnerModule,
    MatStepperModule,
    MatTabsModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    PoolService,
    ProfileService,
    FormBuilder
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
