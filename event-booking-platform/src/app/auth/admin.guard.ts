import { Injectable, signal, Signal, computed } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  private _user = signal<{ email?: string; role?: string }>(this.getUserFromStorage());

  user: Signal<{ email?: string; role?: string }> = computed(() => this._user());

  constructor(private router: Router) {}

  canActivate(): boolean {
    if (this.user().role === 'admin') {
      return true;
    }

    this.router.navigate(['/event-list']);
    return false;
  }

  private getUserFromStorage(): { email?: string; role?: string } {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
}

