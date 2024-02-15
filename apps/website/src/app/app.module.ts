import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MarkdownModule, MARKED_OPTIONS } from 'ngx-markdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    MatSidenavModule,

    MarkdownModule.forRoot({
      loader: HttpClient,
      markedOptions: {
        provide: MARKED_OPTIONS,
        useValue: {
          gfm: true,
        },
      },
    }),

    AppRoutingModule,
    CoreModule,
    SharedModule,
  ],
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
