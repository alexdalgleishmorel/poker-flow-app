import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HubComponent } from '../components/hub/hub.component';
import { HomePage } from './home.page';
import { AccountComponent } from '../components/account/account.component';
import { ActiveGamesListComponent } from '../components/active-games-list/active-games-list.component';
import { PastGamesListComponent } from '../components/past-games-list/past-games-list.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HubComponent,
        children: [
          {
            path: '',
            redirectTo: 'active-games',
            pathMatch: 'full'
          },
          {
            path: 'active-games',
            component: ActiveGamesListComponent
          },
          {
            path: 'past-games',
            component: PastGamesListComponent
          }
        ]
      },
      {
        path: 'account',
        component: AccountComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
