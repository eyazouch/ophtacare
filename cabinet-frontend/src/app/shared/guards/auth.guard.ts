import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    const expectedRoles = route.data['roles'] as string[];
    if (expectedRoles?.length > 0) {
      const userRole = this.authService.getRole();
      if (!userRole || !expectedRoles.includes(userRole)) {
        this.redirectToDashboard();
        return false;
      }
    }
    return true;
  }

  private redirectToDashboard(): void {
    const role = this.authService.getRole();
    const routes: Record<string, string> = {
      PATIENT: '/patient/dashboard',
      MEDECIN: '/medecin/dashboard',
      SECRETAIRE: '/secretaire/dashboard'
    };
    this.router.navigate([routes[role!] ?? '/login']);
  }
}
