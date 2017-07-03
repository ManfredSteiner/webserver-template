import { Component } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="container header">
      <img class="img-responsive center-block" src="../../assets/logo.svg" alt="Logo"/>
      <h1>{{serverName}}</h1>
    <div *ngIf="errorMessage" class="alert alert-danger">
      <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
      <strong>{{errorMessage}}</strong>
    </div>
    </div>
    <div class="container">
      <form class="form-signin" #loginForm="ngForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label class="sr-only" for="inputHtlid">HTL-ID</label>
          <input class="form-control" type="text" placeholder="HTL-ID" required minlength="2" maxlength="24"
                 name="htlid" #name="ngModel" [(ngModel)]="htlid" autofocus/>
        </div>
        <div class="form-group">
          <label class="sr-only" for="inputPassword">Password</label>
          <input class="form-control" type="password" placeholder="Password" required
                 name="password" #name="ngModel" [(ngModel)]="password" />
        </div>
        <button class="btn-lg center-block" type="submit"
                [disabled]="!loginForm.form.valid">
          Login
        </button>
      </form>
    </div>
  `,
  styles: [ `
     @media (min-width: 400px) { .container { max-width: 400px; } }
    .header {
      text-align: center;
      padding: 20px 10px 10px 10px;
    }
    .ng-valid[required], .ng-valid.required  {
      border-left: 5px solid green
    }
    .ng-invalid:not(form) {
      border-left: 5px solid red
    }

  `]
})
export class LoginComponent {
  public serverName = 'webserver-template';
  public errorMessage: string;
  public htlid: string;
  public password: string;

  constructor (private userService: UserService) {
    this.htlid = '';
    this.password = '';
  }

  public onSubmit () {
    console.log('Login htlid="' + this.htlid + '" with password="' + this.password + '"');
    this.userService.login(this.htlid, this.password)
      .then( user => {
        console.log('Login succeeded');
        console.log(user);
      })
      .catch( err => {
        this.errorMessage = 'Login fails';
        setTimeout( () => { this.errorMessage = undefined }, 2000);
        console.log(err);
      });

  }


}
