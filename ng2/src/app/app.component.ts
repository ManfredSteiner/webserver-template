import { Component } from '@angular/core';
import { UserService, IUser } from './services/user.service';

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
  public user: IUser;

  public constructor (private userService: UserService) {
    userService.user.subscribe(this.handleNewUser.bind(this));
  }

  private handleNewUser (user: IUser) {
    this.user = user;
  }

}
