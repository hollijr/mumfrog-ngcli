import { Component, OnInit } from '@angular/core';
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
    private projectService:ProjectService, 
    private route:ActivatedRoute) {  
  }

  ngOnInit():void {
    this.route.params.forEach((params:Params) => {
      let id = +params['id'];
      this.projectService.getProject(id)
      .then(project => this.project = project);
    });
  }

  project:Project;

  goBack():void {
    window.history.back();
  }
}
