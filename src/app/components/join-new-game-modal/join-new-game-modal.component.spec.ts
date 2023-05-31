import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinNewGameModalComponent } from './join-new-game-modal.component';

describe('JoinNewGameModalComponent', () => {
  let component: JoinNewGameModalComponent;
  let fixture: ComponentFixture<JoinNewGameModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinNewGameModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinNewGameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
