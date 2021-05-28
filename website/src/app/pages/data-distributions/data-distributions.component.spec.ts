import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataDistributionsComponent } from './data-distributions.component';

describe('DataDistributionsComponent', () => {
  let component: DataDistributionsComponent;
  let fixture: ComponentFixture<DataDistributionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataDistributionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataDistributionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
