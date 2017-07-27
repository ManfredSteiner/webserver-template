import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

import { IUserLogin } from './models/user';

@Component({
  selector: 'app-modal-login',
  exportAs: 'ModalLoginComponent',
  template: `
    <!--<div name="app-modal-login-div" bsModal #childModal="bs-modal" class="modal fade  bd-example-modal-lg" tabindex="-1" role="dialog"
         aria-labelledby="dialogDeviceLabel" aria-hidden="true">-->
    <div bsModal #childModal="bs-modal" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog"
         aria-labelledby="modalLoginLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{title}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" (click)="cancel($event)">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form class="form-signin" #loginForm="ngForm" (keydown)="keyDown($event)">
              <div class="form-group">
                <label class="sr-only" for="inputHtlid">HTL-ID</label>
                <input #inputHtlid class="form-control" type="text" placeholder="HTL-ID" required minlength="2" maxlength="24"
                       name="htlid" #name="ngModel" [(ngModel)]="htlid" [readonly]="!enableHtlid"/>
              </div>
              <div class="form-group">
                <label class="sr-only" for="inputPassword">Password</label>
                <input #inputPassword class="form-control" type="password" placeholder="Password" required
                       name="password" #name="ngModel" [(ngModel)]="password" />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button #loginButton type="button" class="btn btn-primary"
                   (click)="login(); false" [disabled]="!loginForm.form.valid">Login</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal" (click)="cancel($event); false">Abbrechen</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [ `
    .ng-valid[required], .ng-valid.required  {
      border-left: 5px solid green
    }
    .ng-invalid:not(form) {
      border-left: 5px solid red
    }
  `]
})

export class ModalLoginComponent  {
  @ViewChild('childModal') public childModal: ModalDirective;
  @ViewChild('inputHtlid') private _inputHtlid: ElementRef;
  @ViewChild('inputPassword') private _inputPassword: ElementRef;
  @ViewChild('loginButton') private _loginButton: ElementRef;

  title: string;
  htlid: string;
  enableHtlid: boolean;
  password: string;
  stayLoggedIn = true;

  private _resolve: Function;
  private _reject: Function;
  private _isCancelled: boolean;

  constructor () {
  }

  keyDown (event) {
    // check enter on keyboard
    if (event.keyCode === 13) {
      const el = this._loginButton && this._loginButton.nativeElement;
      if (el && !el.disabled) {
        this.login();
      }
    }
  }

  public show (title?: string, htlid?: string): Promise<IUserLogin> {
    this.title = title || 'Anmeldung erforderlich...';
    this.htlid = htlid;
    this.enableHtlid = (htlid === undefined);
    this.htlid = htlid || '';
    return new Promise<any> ( (resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
      this.childModal.show();

      // needed beacuse autofocus does not work in modal
      // see https://v4-alpha.getbootstrap.com/components/modal/#how-it-works
      this.childModal.onShown.subscribe(() => {
        if (this.enableHtlid) {
          this. _inputHtlid.nativeElement.focus();
        } else {
          this. _inputPassword.nativeElement.focus();
        }
      });

      // needed when user clicks escape
      this.childModal.onEsc = this.cancel.bind(this);

      // needed when user hides modal by clicking outside
      this.childModal.onHidden.subscribe( () => {

        if (!this._isCancelled) {
          this.cancel();
        }
      });
    });
  }

  public login () {
    this.childModal.hide();
    this._resolve( { htlid: this.htlid, password: this.password });
  }

  public cancel (e?) {
    this._isCancelled = true;
    this.childModal.hide();
    this.htlid = undefined;
    this.password = undefined;
    this._resolve( { htlid: this.htlid, password: this.password } );
  }

}

