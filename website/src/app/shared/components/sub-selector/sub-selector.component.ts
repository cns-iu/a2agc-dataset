import { Component, HostBinding, Input, EventEmitter, Output, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'agc-sub-selector',
  templateUrl: './sub-selector.component.html',
  styleUrls: ['./sub-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubSelectorComponent implements OnInit {
  @HostBinding('class') readonly clsName = 'agc-sub-selector';

  @Input() label = '';
  @Input() selection = '';
  @Input() options: string[] = [];
  @Input() subLabel = '';
  @Input() subOptions: string[] = [];
  @Output() readonly selectionChange = new EventEmitter<string>();

  showMenu = false;
  subOptionFilter = 'A';
  readonly LETTERS: string[] = [...Array(26)].map((_val, i) => String.fromCharCode(i + 65));

  ngOnInit(): void {
    if (this.subOptions.length > 0) {
      this.subOptionFilter = this.subOptions[0].charAt(0);
    }
  }

  get allOptions(): string[] {
    if (this.subOptions.length < 1) {
      return this.options;
    }

    return this.options.concat(this.subOptions);
  }

  get enabled(): boolean {
    return this.options.length > 0;
  }

  toggleMenu(): void {
    if (!this.options) {
      this.showMenu = false;
    } else if (this.options.length <= 0) {
      this.showMenu = false;
    } else {
      this.showMenu = !this.showMenu;
    }
  }

  changeSelection(selection: string): void {
    if (selection === this.selection) {
      this.selection = '';
    } else {
      this.selection = selection;
    }

    this.showMenu = false;
    this.selectionChange.emit(this.selection);
  }

  getFilteredSubOptions(): string[] {
    if (this.subOptionFilter === '') {
      return this.subOptions;
    }

    return this.subOptions.filter(option => option.charAt(0).toLowerCase() === this.subOptionFilter.toLowerCase());
  }

  validSubOption(subOption: string): boolean {
    if (!this.subOptions) {
      return false;
    }

    const firstLetters = this.subOptions.map(option => option.charAt(0).toLowerCase());
    if (firstLetters.indexOf(subOption.toLowerCase()) < 0) {
      return false;
    }

    return true;
  }
}
