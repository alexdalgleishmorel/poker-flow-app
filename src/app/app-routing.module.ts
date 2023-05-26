import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HubComponent } from './components/hub/hub.component';
import { LoginComponent } from './components/login/login.component';
import { PoolComponent } from './components/pool/pool.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'hub', component: HubComponent },
  { path: 'login', component: LoginComponent },
  { path: 'pool/:id', component: PoolComponent },
  { path: 'welcome', component: WelcomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
