import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGamesTableComponent } from './user-games-table.component';

describe('UserGamesTableComponent', () => {
  let component: UserGamesTableComponent;
  let fixture: ComponentFixture<UserGamesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGamesTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserGamesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
