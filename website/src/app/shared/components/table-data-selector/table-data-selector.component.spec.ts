import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDataSelectorComponent } from './table-data-selector.component';

describe('TableDataSelectorComponent', () => {
  let component: TableDataSelectorComponent;
  let fixture: ComponentFixture<TableDataSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableDataSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableDataSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
