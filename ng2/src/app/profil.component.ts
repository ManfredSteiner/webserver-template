import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { UserService, IUser } from './services/user.service';


@Component({
  selector: 'app-profil',
  template: `
    <div class="container">
      <h1>{{title}}</h1>
      <h2>Hello {{name}}</h2>
      <button class="but-default" (click)="onLogout()">Logout</button>
      <button class="but-default" (click)="onGetTime()">Show time on server</button>
    </div>
    <div class="messages" style="padding-top:10px">
      <div *ngIf="serverTime" class="alert alert-success">
        <p>Server-Time: {{serverTime}}</p>
      </div>
      <div *ngIf="serverError" class="alert alert-danger">
        <p>Server-Time: {{serverError}}</p>
      </div>
    </div>

  `,
  styles: ['']
})
export class ProfilComponent implements OnInit {
  public title = 'profil works!';
  public name = '?';
  public serverTime: string;
  public serverError: string;

  constructor (private userService: UserService, private http: Http) {}

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

  public onGetTime () {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    this.http.get(this.userService.getServerUrl() + '/data/time', options).toPromise()
      .then( response => {
        this.serverTime = response.json().time;
        setTimeout( () => { this.serverTime = undefined; }, 3000);
      })
      .catch ( error =>  {
        console.log(error);
        this.serverError = 'Error';
        setTimeout( () => { this.serverError = undefined; }, 3000);
      });
  }
}
