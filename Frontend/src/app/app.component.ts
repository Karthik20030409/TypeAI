import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LandingComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'OurApp';
}

