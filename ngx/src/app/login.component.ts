import { Component, ViewChild, ElementRef } from '@angular/core';
import { ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { UserService } from './services/user.service';
import { ServerService } from './services/server.service';

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
    <div class="container" style="text-align: center">
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
    <div class="container" style="margin-top:30px; text-align: center">
      <!--<app-modal-login #modalLogin></app-modal-login>-->
      <button class="btn-default center-block" (click)="test()">Login als admin</button>
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

  constructor (private userService: UserService,
               private serverService: ServerService,
               private componentFactoryResolver: ComponentFactoryResolver,
               private viewContainerRef: ViewContainerRef) {
    this.htlid = '';
    this.password = '';
  }

  public onSubmit () {
    console.log('Login htlid="' + this.htlid + '" with password="' + this.password + '"');
    this.serverService.login(this.viewContainerRef,
                             { htlid: this.htlid, password: this.password, stayLoggedIn: true } ).then( accessToken => {
        console.log('Login succeeded');
        // this.serverService.getLoginUser(this.viewContainerRef, accessToken).then( user => {
        //   console.log(user);
      })
    .catch( this.handleError.bind(this));
  }

  // https://medium.com/@tudorgergely/injecting-components-dynamically-in-angular-2-3d36594d49a0

  public test () {
    this.serverService.httpGet('/data/time', this.viewContainerRef).then( result => {
      console.log(result);
    }).catch( err => console.log(err));
  }


  private handleError (err: Error) {
    this.errorMessage = 'Login fails';
    setTimeout( () => { this.errorMessage = undefined }, 2000);
    console.log(err);
  }

}
