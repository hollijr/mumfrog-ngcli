import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../project';
import { GaugeComponent } from '../demo/gauge/gauge.component';
import { DclWrapperComponent } from '../../common/dcl-wrapper/dcl-wrapper.component'; 

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  constructor(
    private sanitizer:DomSanitizer,
    private projectService:ProjectService, 
    private route:ActivatedRoute) {  
  }

  ngOnInit():void {
    this.route.params.forEach((params:Params) => {
      let id = +params['id'];
      //this.projectService.getProject(id)      // PUT THIS BACK FOR PRODUCTION
      // save for development testing
      this.projectService.getMockProject(id)       // COMMENT OUT FOR PRODUCTION
      .then(project => this.project = project);    // COMMENT OUT FOR PRODUCTION
      //.subscribe(project => this.project = project);      // PUT THIS BACK FOR PRODUCTION
    });
  }

  project:Project;

  goBack():void {
    window.history.back();
  }

  trustAsHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.project.demo);
  }
}
