import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {

  constructor(private router: Router) {}

  authMode: 'login' | 'signup' | 'forgot' = 'login';

  isAuthenticated = false;
  isGuest = false;

  name = '';
  email = '';
  password = '';

  errors: any = {};
  showSettings = false;

  typingText = '';
  phrases = [
    'Improve your accuracy ⚡',
    'Boost your typing speed ⏰',
    'Become a typing pro ✨',
  ];
  phraseIndex = 0;
  charIndex = 0;

  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'error'
  };

  ngOnInit() {
    this.typeText();
  }

  /* ================= VALIDATION ================= */

  private isValidEmail(email: string): boolean {
    return email.includes('@') && email.includes('.');
  }

  private isValidPassword(password: string): boolean {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);
    return password.length >= 8 && hasUpper && hasLower && hasNumber && hasSpecial;
  }

  /* ================= AUTH ================= */

  authenticate() {

    // NAME (SIGNUP)
    if (this.authMode === 'signup' && !this.name.trim()) {
      this.showToast('Please enter the name', 'error');
      return;
    }

    // EMAIL
    if (!this.email.trim()) {
      this.showToast('Please enter the email', 'error');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.showToast('Invalid email. Please enter a valid email', 'error');
      return;
    }

    // PASSWORD
    if (!this.password.trim()) {
      this.showToast('Please enter the password', 'error');
      return;
    }

    if (!this.isValidPassword(this.password)) {
      this.showToast(
        'Invalid password. Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character and be at least 8 characters long.',
        'error'
      );
      return;
    }

    // SUCCESS
    this.isAuthenticated = true;

    this.showToast(
      this.authMode === 'login'
        ? 'Logged in successfully'
        : 'Account created successfully',
      'success'
    );
  }

  /* ================= ACTIONS ================= */

  continueAsGuest() {
    this.isGuest = true;
    this.showToast('Logged in as GUEST', 'success');
  }

  startTyping() {
    if (!this.isAuthenticated && !this.isGuest) {
      this.showToast('Please login or continue as guest', 'error');
      return;
    }

    this.router.navigate(['/typing']);
  }

  forgotPassword() {
    this.authMode = 'forgot';
  }

  toggleSettings() {
    this.showSettings = !this.showSettings;
  }

  /* ================= TOAST ================= */

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toast.message = message;
    this.toast.type = type;
    this.toast.show = true;

    setTimeout(() => {
      this.toast.show = false;
      if (type === 'success') {
        this.router.navigate(['/typing']);
      }
    }, type === 'success' ? 1000 : 2000);
  }

  /* ================= TYPING EFFECT ================= */

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
