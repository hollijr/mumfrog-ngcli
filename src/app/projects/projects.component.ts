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
    this.getProjects();
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

  getProjects():void {
    // simulate server response delay using getprojectesSlowly() instead of getprojects()
    this.projectService.getProjects().then((response) => {
      this.projects = response;
    });  
  }

  goToDetail(project:Project):void {
    this.onSelect(project);
    this.router.navigate(['/detail', this.selectedProject.id]);
  }

}
