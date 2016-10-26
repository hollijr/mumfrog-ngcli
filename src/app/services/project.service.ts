import { Injectable } from '@angular/core';

import { Project } from '../projects/project';
import { PROJECTS } from '../api/mock-projects';

// dynamic components
import { GaugeComponent } from '../projects/demo/gauge/gauge.component';

@Injectable()
export class ProjectService {

  // properties
  componentTable = {
    'GaugeComponent': GaugeComponent
  };

  // structural methods
  constructor() { }

  // custom methods
  getProjects():Promise<Project[]> {
    return Promise.resolve(PROJECTS);
  }
  getProjectsSlowly():Promise<Project[]> {
    return new Promise<Project[]>(resolve =>
      setTimeout(resolve, 2000)) // delay 2 seconds
      .then(this.getProjects);
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
