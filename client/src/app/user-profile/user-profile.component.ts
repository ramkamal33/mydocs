import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-user-profile',
  template: `
    <ul *ngIf="auth.user$ | async as user">
      <li>{{ user.nickname }} <img width="40" height="40" src="{{user?.picture}}" class="avatar" alt="avatar"></li>
      <!-- <li>{{ user.email }}</li> -->
    </ul>`,
  standalone: true,
  imports: [CommonModule],
})
export class UserProfileComponent {
  constructor(public auth: AuthService) {}
}