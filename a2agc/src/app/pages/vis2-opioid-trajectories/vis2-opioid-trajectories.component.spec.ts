import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vis2OpioidTrajectoriesComponent } from './vis2-opioid-trajectories.component';

describe('Vis2OpioidTrajectoriesComponent', () => {
  let component: Vis2OpioidTrajectoriesComponent;
  let fixture: ComponentFixture<Vis2OpioidTrajectoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Vis2OpioidTrajectoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Vis2OpioidTrajectoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
