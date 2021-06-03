import { Component, HostBinding, Input, EventEmitter, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'agc-sub-selector',
  templateUrl: './sub-selector.component.html',
  styleUrls: ['./sub-selector.component.scss']
})
export class SubSelectorComponent {
  @HostBinding('class') readonly clsName = 'agc-sub-selector';

  @Input() label = '';
  @Input() selection = '';
  @Input() options: string[] = [];
  @Input() subLabel = '';
  @Input() subOptions: string[] = [];
  @Output() selectionChange = new EventEmitter<string>();

  handleSelectionChange(event: MatSelectChange): void {
    this.selectionChange.emit(event.value);
  }
}
