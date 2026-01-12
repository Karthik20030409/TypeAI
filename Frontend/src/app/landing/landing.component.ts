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

    if (this.authMode === 'signup' && !this.name) {
      this.errors.name = 'Please enter your name';
    }
    if (!this.email) {
      this.errors.email = 'Please enter your email';
    }
    if (!this.password) {
      this.errors.password = 'Please enter your password';
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
