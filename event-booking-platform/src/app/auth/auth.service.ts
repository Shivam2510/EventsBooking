import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = signal<boolean>(this.hasUser()); // ✅ Signal for login state

  private hasUser(): boolean {
    return !!localStorage.getItem('user'); // ✅ Check if user exists
  }

  isLoggedIn() {
    return this.loggedIn(); // ✅ Return signal value
  }

  login(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.loggedIn.set(true); // ✅ Signal updates reactively
  }

  logout() {
    localStorage.removeItem('user');
    this.loggedIn.set(false); // ✅ Signal updates reactively
  }
}
