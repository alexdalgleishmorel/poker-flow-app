import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipDepositModalComponent } from './chip-deposit-modal.component';

describe('ChipDepositModalComponent', () => {
  let component: ChipDepositModalComponent;
  let fixture: ComponentFixture<ChipDepositModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChipDepositModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChipDepositModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
