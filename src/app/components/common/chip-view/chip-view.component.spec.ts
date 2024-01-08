import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipViewComponent } from './chip-view.component';

describe('ChipViewComponent', () => {
  let component: ChipViewComponent;
  let fixture: ComponentFixture<ChipViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChipViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChipViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
