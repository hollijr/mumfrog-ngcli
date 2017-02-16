/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LlTrainComponent } from './ll-train.component';

describe('LlTrainComponent', () => {
  let component: LlTrainComponent;
  let fixture: ComponentFixture<LlTrainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LlTrainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LlTrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
