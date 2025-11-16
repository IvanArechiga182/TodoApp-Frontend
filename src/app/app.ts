import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { AuthService } from './services/auth/auth-service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLinkWithHref],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(public auth: AuthService) {}

  get authUser() {
    return this.auth.authUser;
  }

  get logOutButtonText() {
    return this.auth.logOut;
  }
}
