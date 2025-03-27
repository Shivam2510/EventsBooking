import { Component, Signal, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush, // Optimized Change Detection
})

export class LoginComponent {

  private _errorMessage = signal<string>('');
  errorMessage: Signal<string> = computed(() => this._errorMessage());
  loginForm!:FormGroup

  constructor(private fb: FormBuilder, private router: Router) {}
 
  ngOnInit(){
     // Signals for managing state
  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  }


  protected login() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    const userCredentials = [
      { email: 'admin@gmail.com', password: 'admin123', role: 'admin', redirect: '/events' },
      { email: 'user@gmail.com', password: 'user123', role: 'user', redirect: '/event-list' },
    ];

    const user = userCredentials.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('user', JSON.stringify({ email: user.email, role: user.role }));
      this.router.navigate([user.redirect]);
    } else {
      this._errorMessage.set('Invalid email or password');
    }
  }
}

