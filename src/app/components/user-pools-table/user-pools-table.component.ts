import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PoolData, PoolService } from 'src/app/services/pool/pool.service';
import { Profile, ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-user-pools-table',
  templateUrl: './user-pools-table.component.html',
  styleUrls: ['./user-pools-table.component.scss']
})
export class UserPoolsTableComponent implements OnInit {
  @Input() disabled: boolean = false;
  @Input() history: boolean = false;
  @Input() dataSource: PoolData[] = [];
  public displayedColumns: string[] = [];

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.displayedColumns = !this.history ? ['pool-name', 'pot', 'members', 'created'] : ['pool-name', 'members', 'created'];
  }

  openGame(poolID: string) {
    this.router.navigate(['/', `pool`, poolID]);
  }
}