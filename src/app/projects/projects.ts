import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { PROJECTS_ROUTING } from './projects.routing';

import { ProjectsComponent } from './projects.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';

import { ProjectService } from '../services/project.service';
import { DclWrapperComponent } from '../common/dcl-wrapper/dcl-wrapper.component';
import { ArrayifyPipe } from '../common/arrayify.pipe';
import { GaugeComponent } from './demo/gauge/gauge.component';
import { VisalgoComponent } from './demo/visalgo/visalgo.component';
import { PythonSamplesComponent } from './demo/python-samples/python-samples.component';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectDetailComponent,
    DclWrapperComponent,
    ArrayifyPipe,
    GaugeComponent,
    VisalgoComponent,
    PythonSamplesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule, 
    PROJECTS_ROUTING
  ],
  providers: [
    ProjectService
  ],
  entryComponents: [ GaugeComponent, VisalgoComponent, PythonSamplesComponent ],
})
class ProjectsModule { }
