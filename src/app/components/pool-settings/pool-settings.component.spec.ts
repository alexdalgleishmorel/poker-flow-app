import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolSettingsComponent } from './pool-settings.component';

describe('PoolSettingsComponent', () => {
  let component: PoolSettingsComponent;
  let fixture: ComponentFixture<PoolSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoolSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoolSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
