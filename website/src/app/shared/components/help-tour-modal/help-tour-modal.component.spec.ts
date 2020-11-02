import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpTourModalComponent } from './help-tour-modal.component';

describe('HelpTourModalComponent', () => {
  let component: HelpTourModalComponent;
  let fixture: ComponentFixture<HelpTourModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpTourModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpTourModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
