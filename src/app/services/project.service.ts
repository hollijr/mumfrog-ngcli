import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Project } from '../projects/project';
import { PROJECTS } from '../api/mock-projects';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// dynamic components
import { GaugeComponent } from '../projects/demo/gauge/gauge.component';

@Injectable()
export class ProjectService {

  // properties
  componentTable = {
    'GaugeComponent': GaugeComponent
  };

  // Resolve HTTP using the constructor
  constructor(private http: Http) { }

  // private instance variable to hold base url
  private projectsUrl = './api/getProjects.php'; 
  private projects;
  private observable:Observable<any>;

  // custom methods
  getProjectsArray() {
    console.log('getProjects1 called');
    if (this.projects) {
      console.log('projects already available');
      return Observable.of(this.projects);
    } else if (this.observable) {
      console.log('request pending');
      return this.observable;
    } else {
      console.log('send new request');
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.observable = this.http.get(this.projectsUrl, { headers: headers })
        .map(response => {
          console.log('response arrived');
          this.observable = null;
          if (response.status == 400) {
            return "FAILURE";
          } else if (response.status == 200) {
            this.projects = JSON.parse(response.json()).projects;
            return this.projects;
          }
        })
        .share();  
        return this.observable;
    }
  }
  
  getProject(id:number) {
    return this.getProjectsArray()
                .map(projects => projects.find(project => project.id === id))
                .map((project) => {
                  if (project.componentName) {
                    project.component = this.componentTable[project.componentName];
                  }
                  console.log('got project detail');
                  return project;
                });
  }
  getFavorites() {
    return this.getProjectsArray()
                .map(projects => projects.filter(project => project.isFavorite))};

  // save these for development testing
  getMockProjects():Promise<Project[]> {
    return Promise.resolve(PROJECTS);
  }
  getMockProject(id:number):Promise<Project> {
    return this.getMockProjects()
                .then(projects => projects.find(project => project.id === id))
                .then((project) => {
                  if (project.componentName) {
                    project.component = this.componentTable[project.componentName];
                  }
                  return project;
                });
  }

}
