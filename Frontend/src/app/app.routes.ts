// import { Routes } from '@angular/router';
// import { LoginComponent } from './login/login.component';
// import { LandingComponent } from './landing/landing.component';

// export const routes: Routes = [
//   { path: '', component: LandingComponent },
//   { path: 'login', component: LoginComponent }
// ];
import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { TypingComponent } from './typing/typing.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'typing', component: TypingComponent },
];

