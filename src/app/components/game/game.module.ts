import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AppCommonModule } from '../common/common.module';

import { GameComponent } from './game.component';

/**
 * ActivityContainer component and its sub-components
 */
import { ActivityContainerComponent } from './activity-container/activity-container.component';
import { ActivityTableComponent } from './activity-container/activity-table/activity-table.component';
import { TransactionSummaryModalComponent } from './activity-container/activity-table/transaction-summary-modal/transaction-summary-modal.component';

/**
 * BuyInModal component and its sub-components
 */
import { BuyInModalComponent } from './buy-in-modal/buy-in-modal.component';

/**
 * ChartContainer component and its sub-components
 */
import { ChartContainerComponent } from './chart-container/chart-container.component';
import { DonutChartComponent } from './chart-container/donut-chart/donut-chart.component';

/**
 * ChipDeposit component and its sub-components
 */
import { ChipDepositModalComponent } from './chip-deposit-modal/chip-deposit-modal.component';

/**
 * GameSettings component and its sub-components
 */
import { GameSettingsComponent } from './settings/settings.component';

/**
 * ShareGame component and its sub-components
 */
import { ShareGameComponent } from './share/share.component';

@NgModule({
  declarations: [
    ActivityContainerComponent,
    ActivityTableComponent,
    BuyInModalComponent,
    ChartContainerComponent,
    ChipDepositModalComponent,
    DonutChartComponent,
    GameComponent,
    GameSettingsComponent,
    ShareGameComponent,
    TransactionSummaryModalComponent
  ],
  imports: [
    AppCommonModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ],
  exports: [
    ActivityContainerComponent,
    ActivityTableComponent,
    BuyInModalComponent,
    ChartContainerComponent,
    ChipDepositModalComponent,
    DonutChartComponent,
    GameComponent,
    GameSettingsComponent,
    ShareGameComponent,
    TransactionSummaryModalComponent
  ]
})
export class GameModule {}
