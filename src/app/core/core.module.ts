import { NgModule, Optional, SkipSelf } from '@angular/core';

import { BannerModule } from './components/banner/banner.module';
import { PageFooterModule } from './components/page-footer/page-footer.module';
import { PageHeaderModule } from './components/page-header/page-header.module';
import { PageMenuModule } from './components/page-menu/page-menu.module';
import { SubBarModule } from './components/sub-bar/sub-bar.module';
import { ThemeModule } from './services/theme/theme.module';
import { StateModule } from './state/state.module';


@NgModule({
  imports: [
    // Services
    ThemeModule.forRoot(),
    StateModule,

    // Components
    BannerModule,
    PageFooterModule,
    PageHeaderModule,
    PageMenuModule,
    SubBarModule
  ],
  exports: [
    // Module forwarding
    BannerModule,
    PageFooterModule,
    PageHeaderModule,
    PageMenuModule,
    SubBarModule,
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() other: CoreModule | null) {
    if (other) {
      throw new Error('CoreModule should only be imported once in the AppModule!');
    }
  }
}
