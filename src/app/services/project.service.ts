import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

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

  // custom methods
  
  getProjects():Promise<Project[]> {
    return Promise.resolve(PROJECTS);
  }
  
  getPhpProjects():Observable<any> {
    return this.http.get(this.projectsUrl)
      .map((res) => res.json())
      .catch((error:any) => Observable.throw('Server error'));
  }
  
  getProject(id:number):Promise<Project> {
    return this.getProjects()
                .then(projects => projects.find(project => project.id === id))
                .then((project) => {
                  if (project.componentName) {
                    project.component = this.componentTable[project.componentName];
                  }
                  return project;
                });
  }
  getFavorites():Promise<Project[]> {
    return this.getProjects()
                .then(projects => projects.filter(project => project.isFavorite))};

}
