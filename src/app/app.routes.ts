// import { Routes } from '@angular/router';
// import { LoginComponent } from './login/login.component';
// import { LandingComponent } from './landing/landing.component';

// export const routes: Routes = [
//   { path: '', component: LandingComponent },
//   { path: 'login', component: LoginComponent }
// ];
import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: '' }
];
