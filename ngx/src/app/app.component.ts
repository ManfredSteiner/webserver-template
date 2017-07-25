import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="!user" class="container">
      <app-login></app-login>
    </div>
    <div *ngIf="user" class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [  ]
})
export class AppComponent {
  public title = 'app';
  public user: User;

  public constructor (private userService: UserService) {
    userService.subscribe(this.handleNewUser.bind(this));
  }

  private handleNewUser (user: User) {
    this.user = user;
  }

}
