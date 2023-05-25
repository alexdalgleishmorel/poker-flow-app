import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolDonutChartComponent } from './pool-donut-chart.component';

describe('PoolDonutChartComponent', () => {
  let component: PoolDonutChartComponent;
  let fixture: ComponentFixture<PoolDonutChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoolDonutChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoolDonutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
