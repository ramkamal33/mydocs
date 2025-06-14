import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-logout-button',
  template: `
    <button  style="background-color:rgb(38, 38, 187);padding: 5px 15px;ng;color: #fff;border-radius: 4px;font-size: 17px;padding: 8px 20px;text-transform: capitalize;"  (click)="logout()">
     <b> Log out</b>
    </button>
  `,
  standalone: true
})
export class LogoutButtonComponent {
  constructor(
    @Inject(DOCUMENT) public document: Document,
    
    private auth: AuthService
  ) {}

  logout() {
    
    this.auth.logout({ 
      logoutParams: {
    //  returnTo: "http://localhost:4200/"
     returnTo:"https://talashlogs.z26.web.core.windows.net/"
      }
    });
  }
}