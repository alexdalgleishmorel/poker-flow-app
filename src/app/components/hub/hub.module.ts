import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppCommonModule } from '../common/common.module';

import { HubComponent } from './hub.component';

/**
 * CreateGameModal component and its sub-components
 */
import { CreateGameModalComponent } from './create-game-modal/create-game-modal.component';

/**
 * GamesList component and its sub-components
 */
import { GamesListComponent } from './games-list/games-list.component';
import { UserGamesTableComponent } from './games-list/user-games-table/user-games-table.component';

/**
 * JoinGameModal component and its sub-components
 */
import { JoinGameModalComponent } from './join-game-modal/join-game-modal.component';

@NgModule({
    declarations: [
        CreateGameModalComponent,
        GamesListComponent,
        HubComponent,
        JoinGameModalComponent,
        UserGamesTableComponent
    ],
    imports: [
        AppCommonModule,
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule
    ],
    exports: [
        CreateGameModalComponent,
        GamesListComponent,
        HubComponent,
        JoinGameModalComponent,
        UserGamesTableComponent
    ]
})
export class HubModule {}
