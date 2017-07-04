import { Component } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="container header">
      <img class="img-responsive center-block" src="../../assets/logo.svg" alt="Logo"/>
    </div>
    <div class="container">
      <form class="form-signin" #loginForm="ngForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label class="sr-only" for="inputHtlid">HTL-ID</label>
          <input class="form-control" type="text" placeholder="HTL-ID"
                 required minlength="2" maxlength="24"
                 name="htlid" #name="ngModel" [(ngModel)]="htlid"/>
        </div>
        <div class="form-group">
          <label class="sr-only" for="inputPassword">Password</label>
          <input class="form-control" type="password" placeholder="Password" required
                 name="password" #name="ngModel" [(ngModel)]="password" />
        </div>
        <button class="btn-lg btn-default center-block" type="submit"
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
      padding: 20px 10px 30px 10px;
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
      })
      .catch( err => {
        console.log(err);
      });

  }


}
