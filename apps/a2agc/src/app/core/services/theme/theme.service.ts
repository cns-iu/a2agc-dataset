import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentRef, Inject, Injectable, InjectionToken, OnDestroy, Optional } from '@angular/core';


/**
 * Theme options
 */
export interface ThemeOptions {
  /** Theme name */
  theme?: string;
  /** Default theme */
  default?: string;
}

/**
 * Theme options injection token
 */
export const THEME_OPTIONS = new InjectionToken<ThemeOptions>('Theme options');


/**
 * Service for managing themes
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService implements OnDestroy {
  /** Default theme */
  readonly defaultTheme: string;

  /**
   * Gets current theme
   */
  get theme(): string {
    return this.currentTheme;
  }
  /**
   * Sets current theme
   */
  set theme(theme: string) {
    const newTheme = theme || this.defaultTheme;
    const oldTheme = this.currentTheme;
    this.currentTheme = newTheme;
    this.switchTheme(this.elements, newTheme, oldTheme);
  }

  /** Elements to be managed by the theme service */
  private readonly elements: HTMLElement[] = [];
  /** Current theme */
  private currentTheme: string;

  /**
   * Creates an instance of theme service.
   * @param options theme options
   * @param overlay overlay container
   */
  constructor(@Inject(THEME_OPTIONS) options: ThemeOptions,
    @Optional() overlay: OverlayContainer | null,
  ) {
    this.defaultTheme = options.default ?? '';
    this.currentTheme = options.theme ?? this.defaultTheme;

    const overlayEl = overlay?.getContainerElement();
    if (overlayEl) {
      this.addElement(overlayEl);
    }
  }

  /**
   * Removes all elements from service
   */
  ngOnDestroy(): void {
    // Make a copy of the array since it is modified during the loop
    const elements = [...this.elements];
    for (const el of elements) {
      this.removeElement(el);
    }
  }

  /**
   * Adds an HTML element to the list of elements managed by the service
   */
  addBootstrapComponent(ref: ComponentRef<unknown>): void {
    const el = ref.location.nativeElement as HTMLElement | null;
    if (el) {
      this.addElement(el);
      ref.onDestroy(() => this.removeElement(el));
    }
  }

  /**
   * Adds HTML element to the list of elements
   * @param el element
   */
  addElement(el: HTMLElement): void {
    this.switchTheme([el], this.currentTheme, '');
    this.elements.push(el);
  }

  /**
   * Removes HTML element to the list of elements
   * @param el element
   */
  removeElement(el: HTMLElement): void {
    const index = this.elements.indexOf(el);
    if (index >= 0) {
      this.elements.splice(index, 1);
      this.switchTheme([el], '', this.currentTheme);
    }
  }

  /**
   * Switches themes for certain elements
   * @param elements elements to switch themes
   * @param newTheme new theme
   * @param oldTheme old theme
   */
  private switchTheme(elements: HTMLElement[], newTheme: string, oldTheme: string): void {
    this.addClass(elements, 'color-transitions-disabled');
    this.removeClass(elements, oldTheme);
    this.addClass(elements, newTheme);
    setTimeout(() => this.removeClass(elements, 'color-transitions-disabled'));
  }

  /**
   * Adds CSS class to specified elements
   * @param elements array of HTML elements
   * @param klass class name to add
   */
  private addClass(elements: HTMLElement[], klass: string): void {
    if (klass) {
      for (const el of elements) {
        el.classList.add(klass);
      }
    }
  }

  /**
   * Removes CSS class from specified elements
   * @param elements array of HTML elements
   * @param klass class name to remove
   */
  private removeClass(elements: HTMLElement[], klass: string): void {
    if (klass) {
      for (const el of elements) {
        el.classList.remove(klass);
      }
    }
  }
}
