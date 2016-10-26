import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ROUTING } from './app.routing';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';

import { ProjectService } from './services/project.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    ProjectsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule, 
    ROUTING
  ],
  providers: [
    ProjectService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
