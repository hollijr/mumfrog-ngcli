/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VizalgoComponent } from './vizalgo.component';

describe('VizalgoComponent', () => {
  let component: VizalgoComponent;
  let fixture: ComponentFixture<VizalgoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VizalgoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VizalgoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
