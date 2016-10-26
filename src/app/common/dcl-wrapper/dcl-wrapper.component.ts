import {Component, Compiler, ViewContainerRef, ViewChild, Input, Type, ChangeDetectorRef,
  ComponentRef, ComponentFactory, ComponentFactoryResolver} from '@angular/core'

// Helper component to add dynamic components
@Component({
  selector: 'dcl-wrapper',
  template: `<div #target></div>`
})
export class DclWrapperComponent {
  @ViewChild('target', {read: ViewContainerRef}) target: ViewContainerRef;
  @Input() type: Type<Component>;
  cmpRef: ComponentRef<Component>;
  private isViewInitialized:boolean = false;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, 
              private compiler: Compiler,
              private cdRef:ChangeDetectorRef
              ) {}

  updateComponent() {
    if(!this.isViewInitialized) {
      return;
    }
    if(this.cmpRef) {
      // when the `type` input changes we destroy a previously 
      // created component before creating the new one
      this.cmpRef.destroy();
    }

    let factory = this.componentFactoryResolver.resolveComponentFactory(this.type);
    this.cmpRef = this.target.createComponent(factory)
    // to access the created instance use
    // this.compRef.instance.someProperty = 'someValue';
    // this.compRef.instance.someOutput.subscribe(val => doSomething());
  }

  ngOnInit() {
    console.log("OnInit called from dcl");
    this.cdRef.detach();   // prevents Exception: "Expression has changed value since being checked"
  }

  ngOnChanges() {
    console.log("OnChange called from DclWrapper");
    this.updateComponent();
  }

  ngAfterViewInit() {
    this.isViewInitialized = true;
    this.updateComponent();  
    console.log("AfterViewInit from dcl");
    setTimeout(() => this.cdRef.reattach(),0); // bug fix to prevent 'Expression has changed... exception
  }

  ngOnDestroy() {
    if(this.cmpRef) {
      this.cmpRef.destroy();
    }    
  }
}