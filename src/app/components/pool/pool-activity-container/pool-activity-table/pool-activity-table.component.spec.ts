import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolActivityTableComponent } from './pool-activity-table.component';

describe('PoolActivityTableComponent', () => {
  let component: PoolActivityTableComponent;
  let fixture: ComponentFixture<PoolActivityTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoolActivityTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoolActivityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
