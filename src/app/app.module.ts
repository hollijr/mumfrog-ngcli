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
import { ProjectDetailComponent } from './projects/project-detail/project-detail.component';
import { GaugeComponent } from './projects/demo/gauge/gauge.component';
import { DclWrapperComponent } from './common/dcl-wrapper/dcl-wrapper.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    ProjectsComponent,
    ProjectDetailComponent,
    GaugeComponent,
    DclWrapperComponent,
    AboutComponent
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
  entryComponents: [ GaugeComponent ],
  bootstrap: [AppComponent]
})
export class AppModule { }
