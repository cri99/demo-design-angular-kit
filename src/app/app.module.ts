import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {DesignAngularKitModule} from "design-angular-kit";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpBackend} from "@angular/common/http";
import {MultiTranslateHttpLoader} from "ngx-translate-multi-http-loader";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DesignAngularKitModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpBackend) => new MultiTranslateHttpLoader(http, [
          './bootstrap-italia/i18n/', // Load library translations first, so you can edit the keys in your localization file
          './assets/i18n/', // Your i18n location
        ]),
        deps: [HttpBackend],
      },
      defaultLanguage: 'it'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
