import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSelectorComponent } from './sub-selector.component';

describe('SubSelectorComponent', () => {
  let component: SubSelectorComponent;
  let fixture: ComponentFixture<SubSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
