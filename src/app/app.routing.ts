import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProjectsComponent } from './projects/projects.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { ProjectDetailComponent } from './projects/project-detail/project-detail.component';
//import { ArtworksComponent } from './artworks.component';
//import { ArtworkDetailComponent } from './artwork-detail.component';
//import { AboutComponent } from './about.component';

const appRoutes:Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'projects',
    component: ProjectsComponent
  },
  {
    path: 'detail/:id',
    component: ProjectDetailComponent
  },
  /*
  {
    path: 'artworks',
    component: ArtworksComponent
  },
  {
    path: 'artwork/:id',
    component: ArtworkDetailComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },*/
  {
    // redirect
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

export const ROUTING:ModuleWithProviders = RouterModule.forRoot(appRoutes);