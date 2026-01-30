import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TypingService } from '../Services/typing.service'; // ✅ CASE-SENSITIVE PATH

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // ✅ RouterModule added
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {
  constructor(
    private router: Router,
    private typingService: TypingService,
  ) {}

  authMode: 'login' | 'signup' | 'forgot' = 'login';

  isAuthenticated = false;
  isGuest = false;
  authStep: 'form' | 'otp' = 'form';
  otp = '';

  name = '';
  email = '';
  password = '';

  // ✅ HTML depends on this
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
    type: 'success' as 'success' | 'error',
  };

  ngOnInit(): void {
    this.typeText();
  }

  /* ================= AUTH ================= */

  authenticate(): void {
    this.errors = {};

    if (!this.name.trim()) {
      this.errors.name = 'Name is required';
      this.showToast('Please enter the name', 'error');
      return;
    }

    if (!this.email.trim()) {
      this.errors.email = 'Email is required';
      this.showToast('Please enter the email', 'error');
      return;
    }

    if (!this.password.trim()) {
      this.errors.password = 'Password is required';
      this.showToast('Please enter the password', 'error');
      return;
    }

    // 🔗 BACKEND CALL
    
    this.typingService
      .signup({
        username: this.name,
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.showToast(
            'Signup successful. Check backend console for OTP',
            'success',
          );
          this.authStep = 'otp';
        },
        error: (err) => {
          this.showToast(err.error?.message || 'Signup failed', 'error');
        },
      });
  }

  continueAsGuest(): void {
    this.isGuest = true;
    this.showToast('Logged in as GUEST', 'success');
    this.router.navigate(['/typing']);
  }

  startTyping(): void {
    if (!this.isGuest && !this.isAuthenticated) {
      this.showToast('Please login or continue as guest', 'error');
      return;
    }
    this.router.navigate(['/typing']);
  }

  forgotPassword(): void {
    this.authMode = 'forgot';
  }

  toggleSettings(): void {
    this.showSettings = !this.showSettings;
  }

  /* ================= TOAST ================= */

  showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toast.message = message;
    this.toast.type = type;
    this.toast.show = true;

    setTimeout(() => {
      this.toast.show = false;
    }, 2000);
  }

  /* ================= TYPING EFFECT ================= */

  typeText(): void {
    const phrase = this.phrases[this.phraseIndex];
    if (this.charIndex < phrase.length) {
      this.typingText += phrase[this.charIndex++];
      setTimeout(() => this.typeText(), 100);
    } else {
      setTimeout(() => this.eraseText(), 1200);
    }
  }

  eraseText(): void {
    if (this.charIndex > 0) {
      this.typingText = this.typingText.slice(0, -1);
      this.charIndex--;
      setTimeout(() => this.eraseText(), 50);
    } else {
      this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
      this.typeText();
    }
  }
  verifyOtp() {
  if (!this.otp || this.otp.length !== 6) {
    this.errors.otp = 'Enter a valid 6-digit OTP';
    return;
  }

  const payload = {
    email: this.email,
    otp: this.otp
  };

  this.typingService.verifyOtp(payload).subscribe({
    next: (res) => {
      // ✅ OTP verified successfully
      // Example: save token & redirect
      if (res.token) {
        localStorage.setItem('token', res.token);
      }
      this.showToast(
            'Signup successful.',
            'success',
          );
      // redirect / close modal / navigate
      this.router.navigate(['/typing']);
    },
    error: (err) => {
      this.errors.otp = err.error?.message || 'Invalid OTP';
    }
  });
}
resendOtp(){}
  
}
