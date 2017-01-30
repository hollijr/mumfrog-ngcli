/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VisalgoComponent } from './visalgo.component';

describe('VisalgoComponent', () => {
  let component: VisalgoComponent;
  let fixture: ComponentFixture<VisalgoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisalgoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisalgoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
