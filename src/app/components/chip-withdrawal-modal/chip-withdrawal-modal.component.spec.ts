import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipWithdrawalModalComponent } from './chip-withdrawal-modal.component';

describe('ChipWithdrawalModalComponent', () => {
  let component: ChipWithdrawalModalComponent;
  let fixture: ComponentFixture<ChipWithdrawalModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChipWithdrawalModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChipWithdrawalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
