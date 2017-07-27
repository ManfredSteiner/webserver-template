import { Component, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {
  public title = 'app';
  public user: User;

  public constructor (private userService: UserService) {
    userService.subscribe(this.handleNewUser.bind(this));
  }

  public ngOnInit () {
    const el = (<HTMLInputElement>document.getElementById('token'));
    if (el) {
      try {
        const htlid = el.name;
        const remoteToken = el.value;
        // remove tag with token from DOM (should not be longer there for security concerns)
        el.parentNode.removeChild(el);
        this.userService.init(htlid, remoteToken);
        return;
      } catch (error) {
        console.log(error);
      }
    }
  }

  private handleNewUser (user: User) {
    this.user = user;
  }

}
