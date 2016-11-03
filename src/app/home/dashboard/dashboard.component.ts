import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProjectService } from '../../services/project.service';
import { Project } from '../../projects/project';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private projectService:ProjectService,
    private router:Router
  ) { }

  ngOnInit() {
    this.projectService.getFavorites()
          .subscribe(projects => this.favorites = projects);
  }

  favorites:Project[] = [];
  
  goToDetail(project:Project):void {
    let link = ['/detail', project.id];
    this.router.navigate(link);
  }

}
