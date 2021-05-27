import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Visualization } from 'src/app/core/state/visualizations/visualizations';

@Component({
  selector: 'agc-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent implements OnDestroy {
  visualization?: Visualization;

  private readonly subscriptions = new Subscription();

  constructor(private route: ActivatedRoute) {
    const sub = route.data.subscribe(data => {
      this.visualization = data.visualization;
    });
    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
