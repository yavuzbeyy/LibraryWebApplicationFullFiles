// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './AuthService';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true; // Kullanıcı giriş yapmışsa erişime izin ver
    } else {
      this.router.navigate(['/login']); // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
      return false;
    }
  }
}
