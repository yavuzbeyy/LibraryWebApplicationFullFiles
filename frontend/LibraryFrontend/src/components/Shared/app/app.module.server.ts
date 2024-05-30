import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { CommonModule } from '@angular/common';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    CommonModule
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
