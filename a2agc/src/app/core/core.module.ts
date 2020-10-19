import { NgModule, Optional, SkipSelf } from '@angular/core';

import { PageHeaderModule } from './components/page-header/page-header.module';
import { ThemeModule } from './services/theme/theme.module';
import { StateModule } from './state/state.module';


@NgModule({
  imports: [
    StateModule,
    ThemeModule.forRoot({
      default: 'a2agc'
    }),

    PageHeaderModule
  ],
  exports: [
    PageHeaderModule
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() other: CoreModule | null) {
    if (other) {
      throw new Error('CoreModule should only be imported in the AppModule!');
    }
  }
}
