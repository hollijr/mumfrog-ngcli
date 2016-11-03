import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ROUTING } from './app.routing';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectDetailComponent } from './projects/project-detail/project-detail.component';
import { GaugeComponent } from './projects/demo/gauge/gauge.component';
import { DclWrapperComponent } from './common/dcl-wrapper/dcl-wrapper.component';
import { AboutComponent } from './about/about.component';
import { ArtworksComponent } from './artworks/artworks.component';

import { ProjectService } from './services/project.service';
import { ArtworkService } from './services/artwork.service';
import { CategoryService } from './services/category.service';
import { ArtworkDetailComponent } from './artworks/artwork-detail/artwork-detail.component';
import { ArrayifyPipe } from './common/arrayify.pipe';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    ProjectsComponent,
    ProjectDetailComponent,
    GaugeComponent,
    DclWrapperComponent,
    AboutComponent,
    ArtworksComponent,
    ArtworkDetailComponent,
    ArrayifyPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule, 
    ROUTING
  ],
  providers: [
    ProjectService,
    ArtworkService,
    CategoryService
  ],
  entryComponents: [ GaugeComponent ],
  bootstrap: [AppComponent]
})
export class AppModule { }
