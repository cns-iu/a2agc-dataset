import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


interface TourSlide {
  title: string;
  text: string;
  img: string;
}

@Component({
  selector: 'agc-help-tour-modal',
  templateUrl: './help-tour-modal.component.html',
  styleUrls: ['./help-tour-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpTourModalComponent {
  slides: TourSlide[] = [
    {
      title: 'Select year range...',
      text: 'Set year ranges by clicking with your mouse cursor then dragging and releasing. Click again to reset.',
      img: 'assets/images/help-year-range-selector.gif'
    },
    {
      title: 'Select variables and filters...',
      text: 'Click on Variables and filter by items.  SHIFT + CLICK to add more items.',
      img: 'assets/images/help-variables-filterby3.gif'
    },
    {
      title: 'Use controls to filter...',
      text: 'Click on controls to update visualizations.  Use SHIFT + CLICK to add more items.',
      img: 'assets/images/help-filter-controls.gif'
    },
    {
      title: 'Pan and zoom...',
      text: 'Hold down SHIFT key then use the scroll-wheel to zoom.  SHIFT + CLICK (Hold) to pan.',
      img: 'assets/images/help-pan-zoom.gif'
    }
  ];

  currentSlide = 0;

  constructor(public dialogRef: MatDialogRef<HelpTourModalComponent>) { }

  close(): void {
    this.dialogRef.close();
  }

  incrementSlide(): void {
    if (this.currentSlide === (this.slides.length - 1)) {
      return;
    }

    this.currentSlide = this.currentSlide + 1;
  }

  decrementSlide(): void {
    if (this.currentSlide === 0) {
      return;
    }

    this.currentSlide = this.currentSlide - 1;
  }

  setSlide(index: number): void {
    if (index < 0 || index >= this.slides.length) {
      return;
    }

    this.currentSlide = index;
  }
}
