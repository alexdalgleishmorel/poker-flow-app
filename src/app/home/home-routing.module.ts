import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './home.page';
import { AccountComponent } from '../components/account/account.component';
import { HubComponent } from '../components/hub/hub.component';
import { GameComponent } from '../components/game/game.component';
import { ActivityContainerComponent } from '../components/game/activity-container/activity-container.component';
import { ChartContainerComponent } from '../components/game/chart-container/chart-container.component';
import { GameSettingsComponent } from '../components/game/settings/settings.component';
import { ShareGameComponent } from '../components/game/share/share.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HubComponent },
      { path: 'account', component: AccountComponent },
      { path: 'game/:id', component: GameComponent, children: [
        { path: '', redirectTo: 'pot', pathMatch: 'full' },
        { path: 'activity', component: ActivityContainerComponent },
        { path: 'pot', component: ChartContainerComponent },
        { path: 'settings', component: GameSettingsComponent },
        { path: 'share', component: ShareGameComponent }
      ]}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
