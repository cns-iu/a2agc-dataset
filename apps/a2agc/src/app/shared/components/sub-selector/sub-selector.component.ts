import {
  ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges,
} from '@angular/core';


/**
 * Data distributions sub selector component
 */
@Component({
  selector: 'agc-sub-selector',
  templateUrl: './sub-selector.component.html',
  styleUrls: ['./sub-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubSelectorComponent implements OnInit, OnChanges {
  /** HTML class name */
  @HostBinding('class') readonly clsName = 'agc-sub-selector';

  /** Dataset variable form label */
  @Input() label = '';
  /** Dataset variable selection */
  @Input() selection = '';
  /** Dataset variable options */
  @Input() options: string[] = [];
  /** Variable suboptions header label */
  @Input() subLabel = '';
  /** Variable suboptions list */
  @Input() subOptions: string[] = [];
  /** Emits variable selection change */
  @Output() readonly selectionChange = new EventEmitter<string>();

  /** Show the variable selection menu */
  showMenu = false;
  /** Filters for variable suboptions that start with specified letter */
  subOptionFilter = 'A';
  /** Array containing letters of the alphabet */
  readonly LETTERS: string[] = [...Array(26)].map((_val, i) => String.fromCharCode(i + 65));

  /**
   * Sets suboptions filter on init
   */
  ngOnInit(): void {
    if (this.subOptions.length > 0) {
      this.subOptionFilter = this.subOptions[0].charAt(0);
    }
  }

  /**
   * Closes the menu if variable selection is changed
   */
  ngOnChanges(changes: SimpleChanges): void {
    if ('selection' in changes) {
      this.showMenu = false;
    }
  }

  /**
   * Gets all dataset variable options and suboptions
   */
  get allOptions(): string[] {
    if (this.subOptions.length < 1) {
      return this.options;
    }

    return this.options.concat(this.subOptions);
  }

  /**
   * Returns true if dataset variable options exist
   */
  get enabled(): boolean {
    return this.options.length > 0;
  }

  /**
   * Shows menu if options exist, otherwise hides menu
   */
  toggleMenu(): void {
    if (!this.options) {
      this.showMenu = false;
    } else if (this.options.length <= 0) {
      this.showMenu = false;
    } else {
      this.showMenu = !this.showMenu;
    }
  }

  /**
   * Changes variable selection and emits value
   * @param selection selected variable
   */
  changeSelection(selection: string): void {
    if (selection === this.selection) {
      this.selection = '';
    } else {
      this.selection = selection;
    }

    this.showMenu = false;
    this.selectionChange.emit(this.selection);
  }

  /**
   * Filters suboptions by first letter specified by subOptionFilter
   * @returns filtered sub options
   */
  getFilteredSubOptions(): string[] {
    if (this.subOptionFilter === '') {
      return this.subOptions;
    }

    return this.subOptions.filter(option => option.charAt(0).toLowerCase() === this.subOptionFilter.toLowerCase());
  }

  /**
   * Checks if suboptions list includes items that start with a letter
   * @param letter letter of alphabet
   * @returns true if there are suboptions that begin with the letter
   */
  validSubOption(letter: string): boolean {
    if (!this.subOptions) {
      return false;
    }

    const firstLetters = this.subOptions.map(option => option.charAt(0).toLowerCase());
    if (firstLetters.indexOf(letter.toLowerCase()) < 0) {
      return false;
    }

    return true;
  }
}
