import { Component } from '@angular/core';
import { UserService, IUser } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
