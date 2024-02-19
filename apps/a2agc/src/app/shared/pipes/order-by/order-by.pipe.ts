import { Inject, LOCALE_ID, Optional, Pipe, PipeTransform } from '@angular/core';


type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T];
type PickByType<T, U> = Pick<T, KeysOfType<T, U>>;

export type SortableKey<T> = keyof PickByType<T, number | string>;
export type SortOrder = 'asc' | 'desc';


@Pipe({
  name: 'orderBy',
  pure: true
})
export class OrderByPipe<T> implements PipeTransform {
  constructor(@Inject(LOCALE_ID) @Optional() private readonly locale: string) { }

  transform(
    items: T[], propertyKey: SortableKey<T>,
    order?: SortOrder, nocase?: 'nocase'
  ): T[] {
    if (!items || items.length === 0 || propertyKey === undefined) {
      return items;
    }

    const collator = new Intl.Collator(this.locale || undefined, {
      usage: 'sort',
      numeric: true,
      sensitivity: nocase === 'nocase' ? 'accent' : 'variant'
    });
    const compare = (x: T, y: T) => {
      const v1 = x[propertyKey] as unknown as string;
      const v2 = y[propertyKey] as unknown as string;

      if (v1 == null) {
        return v2 == null ? 0 : 1;
      } else if (v2 == null) {
        return -1;
      } else if (order === 'desc') {
        return -collator.compare(v1, v2);
      } else {
        return collator.compare(v1, v2);
      }
    };

    return [...items].sort(compare);
  }
}
