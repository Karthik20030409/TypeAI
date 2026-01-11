import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type AuthMode = 'login' | 'signup';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent {

  // ---- AUTH STATE ----
  isAuthenticated = false;
  showAuthModal = false;
  authMode: AuthMode = 'login';

  // ---- USER MOCK (replace later with real auth) ----
  user = {
    name: 'Alex',
    avatar: 'https://i.pravatar.cc/64'
  };

  // ---- ACTIONS ----
  openLogin() {
    this.authMode = 'login';
    this.showAuthModal = true;
  }

  openSignup() {
    this.authMode = 'signup';
    this.showAuthModal = true;
  }

  closeAuth() {
    this.showAuthModal = false;
  }

  switchMode() {
    this.authMode = this.authMode === 'login' ? 'signup' : 'login';
  }

  authenticate() {
    this.isAuthenticated = true;
    this.showAuthModal = false;
  }

  logout() {
    this.isAuthenticated = false;
  }

  startTyping() {
    if (!this.isAuthenticated) {
      this.openLogin();
      return;
    }
    alert('Typing session started 🚀');
  }
}
