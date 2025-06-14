import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-button',
  template: '<button style="background-color: rgb(75, 144, 234);padding: 5px 15px;ng;color: #fff;border-radius: 4px;font-size: 17px;padding: 8px 20px;text-transform: capitalize;" (click)="login()"><b>Log in</b></button>',
  standalone: true
})
export class LoginButtonComponent {
  constructor(private auth: AuthService) {}

  login() {
    this.auth.loginWithRedirect();
  }
}