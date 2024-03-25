import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';


/**
 * Page header component
 */
@Component({
  selector: 'agc-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageHeaderComponent {
  /** HTML class name */
  @HostBinding('class') readonly clsName = 'agc-page-header';

  /** True if the menu is open */
  @Input() menuOpen = false;
  /** Emits menuOpen value */
  @Output() readonly menuOpenChange = new EventEmitter<boolean>();

  /**
   * Opens/closes the menu and emits the menu state
   */
  toggleMenuOpen(): void {
    this.menuOpen = !this.menuOpen;
    this.menuOpenChange.emit(this.menuOpen);
  }
}
