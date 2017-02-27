import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router'; 
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  routerSubscription: Subscription;

  private _routeScrollPositions: {[url:string] : number }[] = [];
  private _subscriptions:Subscription[] = [];

    constructor(private router: Router) {}

    ngOnInit() {
      // Fix for scrolling to top of new route and to last scroll position when returning to previous route
      /*
      // https://github.com/angular/angular/issues/7791
      // scrolls to top of new route but doesn't handle previous scroll position on return
        this.routerSubscription = this.router.events
            .filter(event => event instanceof NavigationEnd)
            .subscribe(event => {
                window.scroll(0,0);
            });
            */

      // handles scroll position for both forward and backward routes 
      // from @yahasa in https://github.com/angular/angular/issues/10929
      this._subscriptions.push(
        // save or restore scroll position on route change
        this.router.events.pairwise().subscribe(([prevRouteEvent, currRouteEvent]) => {
          if (prevRouteEvent instanceof NavigationEnd && currRouteEvent instanceof NavigationStart) {
            let urlPath = (prevRouteEvent.urlAfterRedirects || prevRouteEvent.url ).split(';',1)[0];
            this._routeScrollPositions[urlPath] = window.pageYOffset;
          }
          if (currRouteEvent instanceof NavigationEnd) {
            // in some cases it need timeout
            setTimeout(()=>{
              // url path without parameters
              let urlPath = (currRouteEvent.urlAfterRedirects || currRouteEvent.url).split(';',1)[0];
              window.scrollTo(0, this._routeScrollPositions[urlPath] || 0);
            }, 0);
          }
        })
      );
    }

    ngOnDestroy() {
        //this.routerSubscription.unsubscribe();
        this._subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
