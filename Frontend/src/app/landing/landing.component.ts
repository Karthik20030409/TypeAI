import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Page = 'landing' | 'typing';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit, OnDestroy {

  /* ---------------- PAGE ---------------- */
  currentPage: Page = 'landing';

  /* ---------------- AUTH ---------------- */
  authMode: 'login' | 'signup' | 'forgot' = 'login';
  isAuthenticated = false;
  isGuest = false;

  /* ---------------- FORM ---------------- */
  name = '';
  email = '';
  password = '';
  newPassword = '';

  errors: {
    name?: string;
    email?: string;
    password?: string;
    start?: string;
  } = {};

  /* ---------------- TIMER ---------------- */
  timer = 60;
  difficulty: 'easy' | 'medium' | 'hard' = 'easy';
  private intervalId: number | null = null;

  /* ---------------- TYPING EFFECT ---------------- */
  typingText = '';
  phrases: string[] = [
    'Improve your accuracy ⚡',
    'Boost your typing speed ⏰',
    'Challenge yourself daily 📝',
    'Become a typing pro ✨',
  ];

  private phraseIndex = 0;
  private charIndex = 0;

  /* ---------------- LIFECYCLE ---------------- */
  ngOnInit(): void {
    this.startTypingEffect();
  }

  ngOnDestroy(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
  }

  /* ---------------- VALIDATION HELPERS ---------------- */
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private isValidPassword(password: string): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
  }

  /* ---------------- AUTH ---------------- */
  authenticate(): void {
    this.errors = {};

    // Name (signup only)
    if (this.authMode === 'signup' && !this.name.trim()) {
      this.errors.name = 'Please enter your name';
    }

    // Email
    if (!this.email) {
      this.errors.email = 'Please enter email';
    } else if (!this.isValidEmail(this.email)) {
      this.errors.email = 'Invalid email format';
    }

    // Password
    if (!this.password) {
      this.errors.password = 'Please enter password';
    } else if (!this.isValidPassword(this.password)) {
      this.errors.password =
        'Password must be 8+ chars with uppercase, lowercase, number & special character';
    }

    if (Object.keys(this.errors).length > 0) return;

    // SIGN UP FLOW
    if (this.authMode === 'signup') {
      alert('Account created successfully 🎉');
      this.authMode = 'login';
      this.password = '';
      return;
    }

    // LOGIN FLOW
    this.isAuthenticated = true;
    this.isGuest = false;
    alert('Logged in successfully ✅');
  }

  /* ---------------- START TYPING ---------------- */
  startTyping(): void {
    this.errors.start = '';

    if (!this.isAuthenticated && !this.isGuest) {
      this.errors.start = 'Please login or signup before continuing';
      return;
    }

    this.goToTypingPage();
  }

  private goToTypingPage(): void {
    this.currentPage = 'typing';

    this.timer =
      this.difficulty === 'easy'
        ? 60
        : this.difficulty === 'medium'
        ? 45
        : 30;

    this.startTimer();
  }

  private startTimer(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }

    this.intervalId = window.setInterval(() => {
      this.timer--;

      if (this.timer <= 0 && this.intervalId !== null) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }, 1000);
  }

  /* ---------------- NAV ---------------- */
  goHome(): void {
    this.currentPage = 'landing';

    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.timer = 60;
  }

  /* ---------------- FORGOT PASSWORD ---------------- */
  forgotPassword(): void {
    this.authMode = 'forgot';
    this.errors = {};
  }

  resetPassword(): void {
    this.errors = {};

    if (!this.email || !this.isValidEmail(this.email)) {
      this.errors.email = 'Enter a valid email';
      return;
    }

    if (!this.isValidPassword(this.newPassword)) {
      this.errors.password =
        'Password must be 8+ chars with uppercase, lowercase, number & special character';
      return;
    }

    alert('Password reset successful ✅');

    this.authMode = 'login';
    this.password = '';
    this.newPassword = '';
  }

  /* ---------------- GUEST ---------------- */
  continueAsGuest(): void {
    this.isGuest = true;
    this.isAuthenticated = false;
    this.goToTypingPage();
  }

  /* ---------------- TYPING EFFECT ---------------- */
  private startTypingEffect(): void {
    const phrase = this.phrases[this.phraseIndex];

    if (this.charIndex < phrase.length) {
      this.typingText += phrase[this.charIndex++];
      setTimeout(() => this.startTypingEffect(), 100);
    } else {
      setTimeout(() => this.eraseTyping(), 1500);
    }
  }

  private eraseTyping(): void {
    if (this.charIndex > 0) {
      this.typingText = this.typingText.slice(0, -1);
      this.charIndex--;
      setTimeout(() => this.eraseTyping(), 50);
    } else {
      this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
      this.startTypingEffect();
    }
  }
}
