import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';


/**
 * Page footer component
 */
@Component({
  selector: 'agc-page-footer',
  templateUrl: './page-footer.component.html',
  styleUrls: ['./page-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageFooterComponent {
  /** HTML class name */
  @HostBinding('class') readonly clsName = 'agc-page-footer';

  /** Build date */
  @Input() buildDate = new Date();

  /** Emits when contact button clicked */
  @Output() readonly contactClick = new EventEmitter<void>();
  /** Emits when privacy policy button clicked */
  @Output() readonly privacyClick = new EventEmitter<void>();
}
