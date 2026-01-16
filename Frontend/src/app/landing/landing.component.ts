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

  constructor(private router: Router) { }

  authMode: 'login' | 'signup' | 'forgot' = 'login';
  isAuthenticated = false;
  isGuest = false;

  name = '';
  email = '';
  password = '';
  newPassword = '';

  errors: any = {};
  successMessage = '';

  notifications = 3;
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
    type: 'success' // or 'error'
  };


  ngOnInit() {
    this.typeText();
  }

  get userInitials(): string {
    return this.isGuest ? 'G' : (this.name || this.email)[0]?.toUpperCase();
  }

  forgotPassword() {
    this.authMode = 'forgot';
  }

  authenticate() {
    this.isAuthenticated = true;
    this.showToast(
      this.authMode === 'login'
        ? 'Logged in successfully'
        : 'Account created successfully'
    );

  }
  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toast.message = message;
    this.toast.type = type;
    this.toast.show = true;
    if (this.toast.type == 'success') {
      setTimeout(() => {
        this.toast.show = false;
        this.router.navigate(['/typing']);
      }, 1000);
    }
    if (this.toast.type == 'error') {
      setTimeout(() => {
        this.toast.show = false;
      }, 2000);
    }

  }

  continueAsGuest() {
    this.isGuest = true;
    this.showToast(
      'Logged in as GUEST'
    )
  }

  startTyping() {
    if (!this.isAuthenticated && !this.isGuest) {
      this.errors.start = 'Please login or continue as guest';
      this.showToast(
        'Please login or continue as guest', 'error'
      )

      return;
    }


  }

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
  }

  /* Typing effect */
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
