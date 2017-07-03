import { Component, OnInit } from '@angular/core';
import { UserService, IUser } from './services/user.service';

@Component({
  selector: 'app-profil',
  template: `
    <div class="container">
      <h1>{{title}}</h1>
      <h2>Hello {{name}}</h2>
      <button class="but-default" (click)="onLogout()">Logout</button>
    </div>
  `,
  styles: ['']
})
export class ProfilComponent implements OnInit {
  public title = 'profil works!';
  public name = '?';

  constructor (private userService: UserService) {}

  ngOnInit(): void {
    const user = this.userService.getLoginUser();
    if (user) {
      this.name = user.firstname + ' ' + user.surname + ' (' + user.htlid + ')';
    } else {
      console.log(new Error('No Login user available'));
    }
  }

  public onLogout () {
    console.log('Logout');
    this.userService.logout();
  }
}
