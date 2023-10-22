import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HubComponent } from '../components/hub/hub.component';
import { HomePage } from './home.page';
import { AccountComponent } from '../components/account/account.component';
import { ActiveGamesListComponent } from '../components/active-games-list/active-games-list.component';
import { PastGamesListComponent } from '../components/past-games-list/past-games-list.component';
import { PoolComponent } from '../components/pool/pool.component';
import { PoolChartContainerComponent } from '../components/pool-chart-container/pool-chart-container.component';
import { PoolActivityContainerComponent } from '../components/pool-activity-container/pool-activity-container.component';
import { PoolSettingsComponent } from '../components/pool-settings/pool-settings.component';
import { StatsComponent } from '../components/stats/stats.component';
import { SharePoolComponent } from '../components/share-pool/share-pool.component';

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
      },
      {
        path: 'pool/:id',
        component: PoolComponent,
        children: [
          {
            path: '',
            redirectTo: 'pot',
            pathMatch: 'full'
          },
          {
            path: 'activity',
            component: PoolActivityContainerComponent
          },
          {
            path: 'pot',
            component: PoolChartContainerComponent
          },
          {
            path: 'settings',
            component: PoolSettingsComponent
          },
          {
            path: 'stats',
            component: StatsComponent
          },
          {
            path: 'share',
            component: SharePoolComponent
          }
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
