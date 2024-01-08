import { NgModule } from '@angular/core';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { BASE_API_URL } from './services/api/api.service';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor, AuthService } from './services/auth/auth.service';

import { GameService } from './services/game/game.service';

import { AccountModule } from './components/account/account.module';
import { AppCommonModule } from './components/common/common.module';
import { GameModule } from './components/game/game.module';
import { HubModule } from './components/hub/hub.module';
import { LoginModule } from './components/login/login.module';

const config: SocketIoConfig = { url: BASE_API_URL, options: {transports: ['websocket'], reconnection: true}};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AccountModule,
    AppCommonModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    GameModule,
    HttpClientModule,
    HubModule,
    IonicModule.forRoot(),
    LoginModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [
    AuthService,
    GameService,
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
