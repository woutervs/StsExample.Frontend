import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { AuthorizationService } from './authorization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private titleService: Title, private router: Router, private activatedRoute: ActivatedRoute, private authorizationService: AuthorizationService) { }

  ngOnInit() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      , filter((route) => route.outlet === 'primary')
      , mergeMap((route) => route.data)).
      subscribe((event) => {
        this.titleService.setTitle(`Stsexample::${event['title']}`);
      });
  }
}
