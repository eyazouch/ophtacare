import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <div [ngClass]="showSidebar ? 'app-layout' : ''">
      <app-sidebar *ngIf="showSidebar"></app-sidebar>
      <div [ngClass]="showSidebar ? 'main-content' : ''">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  showSidebar = false;
  private publicRoutes = ['/login', '/register'];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.showSidebar = !this.publicRoutes.includes(e.urlAfterRedirects);
    });
  }
}
