import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent {
  isAuthenticated = false;
  showAuth = false;
  authMode: 'login' | 'signup' = 'login';
  showWarn = false;
  menuOpen = false;

  name = '';
  email = '';
  password = '';
  errors: any = {};

  timer = 60;
  interval: any;

  openAuth(mode: 'login' | 'signup') {
    this.authMode = mode;
    this.showAuth = true;
    this.showWarn = false;
    this.errors = {};
  }

  switchMode() {
    this.authMode = this.authMode === 'login' ? 'signup' : 'login';
    this.errors = {};
  }

  authenticate() {
    this.errors = {};

    /* NAME (signup only) */
    if (this.authMode === 'signup' && !this.name.trim()) {
      this.errors.name = 'Please enter your name';
    }

    /* EMAIL VALIDATION */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email) {
      this.errors.email = 'Please enter your email';
    } else if (!emailRegex.test(this.email)) {
      this.errors.email = 'Please enter a valid email';
    }

    /* PASSWORD VALIDATION */
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!this.password) {
      this.errors.password = 'Please enter your password';
    } else if (!passwordRegex.test(this.password)) {
      this.errors.password =
        'The password must contain at least 1 uppercase, 1 lowercase, 1 special character, 1 number and length must be more than or equal to 8';
    }

    if (Object.keys(this.errors).length) return;

    this.isAuthenticated = true;
    this.showAuth = false;
    this.showWarn = false;
  }

  startTyping() {
    if (!this.isAuthenticated) {
      this.showWarn = true;
      return;
    }
    this.startTimer();
  }

  startTimer() {
    clearInterval(this.interval);
    this.timer = 60;

    this.interval = setInterval(() => {
      this.timer--;
      if (this.timer === 0) clearInterval(this.interval);
    }, 1000);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.isAuthenticated = false;
    this.menuOpen = false;
    this.goHome();
  }

  goHome() {
    this.showAuth = false;
    this.showWarn = false;
    clearInterval(this.interval);
    this.timer = 60;
  }
}
