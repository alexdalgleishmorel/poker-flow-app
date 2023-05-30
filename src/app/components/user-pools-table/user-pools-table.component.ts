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
  public dataSource: PoolData[] = [];
  public displayedColumns: string[] = [];
  @Input() history: boolean = false;

  private profile: Profile;

  constructor(
    private poolService: PoolService,
    private profileService: ProfileService,
    private router: Router
  ) {
    this.profile = this.profileService.getProfile();
    this.poolService.getUserPools(this.profile.email).subscribe((data: PoolData[]) => {
      this.dataSource = data;
    });
  }

  ngOnInit(): void {
    if (!this.history) {
      this.displayedColumns = ['join', 'pool-name', 'pot', 'members', 'created'];
    } else {
      this.displayedColumns = ['created', 'pool-name', 'members'];
    }
  }

  joinGame(poolID: string) {
    this.router.navigate(['/', `pool`, poolID]);
  }
}
