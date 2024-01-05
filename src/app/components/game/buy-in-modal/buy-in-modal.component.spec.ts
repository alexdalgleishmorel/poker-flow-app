import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyInModalComponent } from './buy-in-modal.component';

describe('BuyInModalComponent', () => {
  let component: BuyInModalComponent;
  let fixture: ComponentFixture<BuyInModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyInModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyInModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
