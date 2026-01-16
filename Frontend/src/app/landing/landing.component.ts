import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {
  // --- Authentication & UI state ---
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

  // --- Typing effect ---
  typingText = ''; // bind this to template
  phrases = [
    'Improve your accuracy ⚡',
    'Boost your typing speed ⏰',
    'Challenge yourself daily 📝',
    'Become a typing pro ✨',
  ];
  currentPhraseIndex = 0;
  currentCharIndex = 0;
  typingSpeed = 100;
  eraseSpeed = 50;
  pauseDelay = 1500;

  ngOnInit() {
    this.startTypingEffect();
  }

  // ---------------- Authentication methods ----------------
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

  forgotPassword() {}
  continueAsGuest() {}

  // ---------------- Typing effect methods ----------------
  startTypingEffect() {
    this.type();
  }

  private type() {
    const phrase = this.phrases[this.currentPhraseIndex];
    if (this.currentCharIndex < phrase.length) {
      this.typingText += phrase[this.currentCharIndex];
      this.currentCharIndex++;
      setTimeout(() => this.type(), this.typingSpeed);
    } else {
      setTimeout(() => this.erase(), this.pauseDelay);
    }
  }

  private erase() {
    if (this.currentCharIndex > 0) {
      this.typingText = this.typingText.slice(0, -1);
      this.currentCharIndex--;
      setTimeout(() => this.erase(), this.eraseSpeed);
    } else {
      this.currentPhraseIndex =
        (this.currentPhraseIndex + 1) % this.phrases.length;
      setTimeout(() => this.type(), 500);
    }
  }
}
