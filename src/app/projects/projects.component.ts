import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from './project';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectService } from '../services/project.service';  // model

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./project-styles.css','./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  constructor(
    private projectService:ProjectService,
    private router:Router
  ) { }

  ngOnInit() {
    //this.getPhpProjects();      // PUT THIS BACK FOR PRODUCTION
    // save for development testing
    this.getProjects();           // COMMENT OUT FOR PRODUCTION
  }

  selectedProject:Project;
  projects:Project[];
  innerWidth:number = window.innerWidth;

  onResize(event) {
    event.target.innerWith;
  }

  onSelect(project:Project): void {
    this.selectedProject = project;
  }

  getPhpProjects() {
    this.projectService.getProjectsArray()
      .subscribe(response => {
        this.projects = response;
      });
  }

  goToDetail(project:Project):void {
    this.onSelect(project);
    this.router.navigate(['/projects', this.selectedProject.id]);
  }

  // save for development testing
  getProjects():void {
     // simulate server response delay using getprojectesSlowly() instead of getprojects()
     this.projectService.getMockProjects().then((response) => {
       this.projects = response;
     });  
   }

}
