import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionConfirmationModalComponent } from './transaction-confirmation-modal.component';

describe('TransactionConfirmationModalComponent', () => {
  let component: TransactionConfirmationModalComponent;
  let fixture: ComponentFixture<TransactionConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionConfirmationModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
