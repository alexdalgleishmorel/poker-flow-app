import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PoolData, PoolService } from 'src/app/services/pool/pool.service';

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
  @Output() onPoolSelect: EventEmitter<number> = new EventEmitter<number>();
  @Output() onCreateGame: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onJoinGame: EventEmitter<boolean> = new EventEmitter<boolean>();
  public displayedColumns: string[] = [];

  constructor(
    private router: Router
  ) {}

  openGame(poolID: string) {
    this.onPoolSelect.emit(Number(poolID));
    this.router.navigate(['/', `pool`, poolID]);
  }

  createGame() {
    this.onCreateGame.emit();
  }

  joinGame() {
    this.onJoinGame.emit();
  }
}
