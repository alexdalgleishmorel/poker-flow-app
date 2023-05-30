import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPoolsTableComponent } from './user-pools-table.component';

describe('UserPoolsTableComponent', () => {
  let component: UserPoolsTableComponent;
  let fixture: ComponentFixture<UserPoolsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPoolsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPoolsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
