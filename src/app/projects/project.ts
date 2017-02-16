import { Component } from '@angular/core';

export class Project {
  id:number;
  title:string;
  technology:string[];
  summary:string;
  description:string;
  componentName:string;  // name of Angular 2 component class for the demo, if one exists
  component:Component;  // placeholder - used by the dcl-wrapper
  demo:string;  // placed in 'innerHTML' property of div
  demoLink:string;  // placed in anchor element
  codeRepo:string;
  img:string;
  isFavorite:boolean;
}
