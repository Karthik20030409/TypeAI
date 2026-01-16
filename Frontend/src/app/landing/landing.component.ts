import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Page = 'landing' | 'typing';

interface User {
  name: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit, OnDestroy {

  /* ---------- PAGE ---------- */
  currentPage: Page = 'landing';

  /* ---------- AUTH ---------- */
  authMode: 'login' | 'signup' | 'forgot' = 'login';
  isAuthenticated = false;
  isGuest = false;

  /* ---------- FORM ---------- */
  name = '';
  email = '';
  password = '';
  newPassword = '';

  errors: any = {};
  successMessage = '';

  /* ---------- USER STORAGE (DEMO) ---------- */
  private registeredUser: User | null = null;

  /* ---------- HEADER ---------- */
  notifications = 3;
  showSettings = false;

  get userInitials(): string {
    if (this.isGuest) return 'G';
    return this.name
      ? this.name.charAt(0).toUpperCase()
      : this.email.charAt(0).toUpperCase();
  }

  /* ---------- TYPING EFFECT ---------- */
  typingText = '';
  phrases = [
    'Improve your accuracy ⚡',
    'Boost your typing speed ⏰',
    'Become a typing pro ✨',
  ];
  phraseIndex = 0;
  charIndex = 0;

  ngOnInit() {
    this.typeText();
  }

  ngOnDestroy() {}

  /* ---------- VALIDATION ---------- */
  isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidPassword(password: string) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
  }

  /* ---------- AUTH ---------- */
  authenticate() {
    this.errors = {};
    this.successMessage = '';

    /* SIGN UP */
    if (this.authMode === 'signup') {
      if (!this.name.trim()) {
        this.errors.name = 'Please enter your name';
        return;
      }

      if (!this.email || !this.isValidEmail(this.email)) {
        this.errors.email = 'Enter valid email';
        return;
      }

      if (!this.password || !this.isValidPassword(this.password)) {
        this.errors.password =
          'Password must be 8+ chars with uppercase, lowercase, number & special character';
        return;
      }

      this.registeredUser = {
        name: this.name.trim(),
        email: this.email.trim(),
        password: this.password,
      };

      this.successMessage = 'Account created successfully 🎉 Please log in.';
      this.authMode = 'login';
      this.password = '';
      return;
    }

    /* LOGIN */
    if (!this.email || !this.isValidEmail(this.email)) {
      this.errors.email = 'Enter valid email';
      return;
    }

    if (!this.password) {
      this.errors.password = 'Please enter password';
      return;
    }

    if (!this.registeredUser) {
      this.errors.email = 'No account found. Please sign up first';
      return;
    }

    if (this.email !== this.registeredUser.email) {
      this.errors.email = 'Email not registered';
      return;
    }

    if (this.password !== this.registeredUser.password) {
      this.errors.password = 'Wrong password. Please enter the correct password';
      return;
    }

    this.isAuthenticated = true;
    this.name = this.registeredUser.name;
    this.successMessage = 'Logged in successfully ✅';
  }

  /* ---------- FORGOT PASSWORD ---------- */
  forgotPassword() {
    this.errors = {};
    this.successMessage = '';
    this.authMode = 'forgot';
  }

  resetPassword() {
    this.errors = {};
    this.successMessage = '';

    if (!this.email || !this.isValidEmail(this.email)) {
      this.errors.email = 'Enter valid email';
      return;
    }

    if (!this.registeredUser || this.email !== this.registeredUser.email) {
      this.errors.email = 'Email not registered';
      return;
    }

    if (!this.isValidPassword(this.newPassword)) {
      this.errors.password =
        'Password must be 8+ chars with uppercase, lowercase, number & special character';
      return;
    }

    this.registeredUser.password = this.newPassword;
    this.newPassword = '';
    this.authMode = 'login';
    this.successMessage = 'Password reset successful ✅ Please log in';
  }

  /* ---------- GUEST ---------- */
  continueAsGuest() {
    this.isGuest = true;
  }

  /* ---------- START ---------- */
  startTyping() {
    this.errors.start = '';

    if (!this.isAuthenticated && !this.isGuest) {
      this.errors.start = 'Please login/signup before continuing';
      return;
    }

    this.currentPage = 'typing';
  }

  goHome() {
    this.currentPage = 'landing';
  }

  /* ---------- HEADER ---------- */
  toggleSettings() {
    this.showSettings = !this.showSettings;
  }

  clearNotifications() {
    this.notifications = 0;
    this.showSettings = false;
  }

  logout() {
    this.isAuthenticated = false;
    this.isGuest = false;
    this.authMode = 'login';
    this.showSettings = false;
  }

  /* ---------- TYPE EFFECT ---------- */
  typeText() {
    const phrase = this.phrases[this.phraseIndex];

    if (this.charIndex < phrase.length) {
      this.typingText += phrase[this.charIndex++];
      setTimeout(() => this.typeText(), 100);
    } else {
      setTimeout(() => this.eraseText(), 1200);
    }
  }

  eraseText() {
    if (this.charIndex > 0) {
      this.typingText = this.typingText.slice(0, -1);
      this.charIndex--;
      setTimeout(() => this.eraseText(), 50);
    } else {
      this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
      this.typeText();
    }
  }
}
