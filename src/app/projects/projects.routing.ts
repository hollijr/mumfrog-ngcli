import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectsComponent } from './projects.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';


const appRoutes:Routes = [
  {
    path: '',
    component: ProjectsComponent
  },
  {
    path: ':id',
    component: ProjectDetailComponent
  }
];

export const PROJECTS_ROUTING:ModuleWithProviders = RouterModule.forChild(appRoutes);