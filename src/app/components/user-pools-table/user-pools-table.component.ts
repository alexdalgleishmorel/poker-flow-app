import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { PoolData } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-user-pools-table',
  templateUrl: './user-pools-table.component.html',
  styleUrls: ['./user-pools-table.component.scss']
})
export class UserPoolsTableComponent {
  @Input() disabled: boolean = false;
  @Input() history: boolean = false;
  @Input() dataSource: PoolData[] = [];
  @Input() registerUser: boolean = false;
  @Output() onPoolSelect: EventEmitter<PoolData> = new EventEmitter<PoolData>();
  @Output() onCreateGame: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onJoinGame: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() getData: EventEmitter<InfiniteScrollCustomEvent> = new EventEmitter<InfiniteScrollCustomEvent>();
  public displayedColumns: string[] = [];

  constructor(
    private router: Router
  ) {}

  openGame(poolData: PoolData) {
    this.onPoolSelect.emit(poolData);
    if (!this.registerUser) {
      this.router.navigate(['/', `pool`, poolData.id]);
    }
  }

  createGame() {
    this.onCreateGame.emit();
  }

  joinGame() {
    this.onJoinGame.emit();
  }

  onInfiniteScroll(event: any) {
    this.getData.emit(event as InfiniteScrollCustomEvent);
  }
}
