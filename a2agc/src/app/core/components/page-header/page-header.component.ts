import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';


@Component({
  selector: 'agc-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageHeaderComponent {
  @HostBinding('class') readonly clsName = 'agc-page-header';
  @HostBinding('class.mat-elevation-z3') readonly elevation = true;

  @Input() menuOpen = false;
  @Output() menuOpenChange = new EventEmitter<boolean>();

  toggleMenuOpen(): void {
    this.menuOpen = !this.menuOpen;
    this.menuOpenChange.emit(this.menuOpen);
  }
}
