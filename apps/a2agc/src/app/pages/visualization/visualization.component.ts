import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Visualization } from '../../core/state/visualizations/visualizations';


/**
 * Visualization component
 */
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'agc-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent implements OnDestroy {
  /** Visualization metadata */
  visualization?: Visualization;

  /** Subscriptions */
  private readonly subscriptions = new Subscription();

  /**
   * Creates an instance of visualization component and subscribes to data from route
   */
  constructor(route: ActivatedRoute) {
    const sub = route.data.subscribe(data => {
      this.visualization = data.visualization;
    });
    this.subscriptions.add(sub);
  }

  /**
   * Unsubscribes to all subscriptions on destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
