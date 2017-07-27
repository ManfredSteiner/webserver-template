import { Component, ViewContainerRef, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from './services/user.service';
import { ServerService } from './services/server.service';

@Component({
  selector: 'app-login',
  template: `

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
export class LoginComponent implements OnInit {
  public serverName = 'webserver-template';
  public errorMessage: string;
  public htlid: string;
  public password: string;

  constructor (private userService: UserService,
               private serverService: ServerService,
               private viewContainerRef: ViewContainerRef) {
    this.htlid = '';
    this.password = '';
  }

  public ngOnInit () {
    // this.serverService.login(this.viewContainerRef, 'Login erforderlich').then(accessToken => {
    this.serverService.authenticate(this.viewContainerRef).then(accessToken => {
      console.log('Login succeeded');
    }).catch(err => {
      console.log(err);
      setTimeout(this.ngOnInit.bind(this), 100);
    })
  }



}
