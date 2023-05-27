import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDeviceModalComponent } from './search-device-modal.component';

describe('ConnectDeviceModalComponent', () => {
  let component: SearchDeviceModalComponent;
  let fixture: ComponentFixture<SearchDeviceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchDeviceModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchDeviceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
