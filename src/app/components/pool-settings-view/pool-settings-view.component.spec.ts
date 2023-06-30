import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolSettingsViewComponent } from './pool-settings-view.component';

describe('PoolSettingsViewComponent', () => {
  let component: PoolSettingsViewComponent;
  let fixture: ComponentFixture<PoolSettingsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoolSettingsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoolSettingsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
