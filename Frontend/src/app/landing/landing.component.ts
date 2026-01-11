import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent {constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
