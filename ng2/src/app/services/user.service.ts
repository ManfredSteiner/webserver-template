import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Subject} from 'rxjs/Rx';

const serverUrl = 'http://localhost:8080';
// const serverUrl = '';

@Injectable()
export class UserService {

  public user: Subject<IUser> = new Subject();
  private _authResponse: { htlid: string, token: string };
  private _user: IUser;


  constructor (private http: Http) {
  }

  public getLoginUser (): IUser {
    return this._user;
  }

  public getServerUrl (): string {
    return serverUrl;
  }

  public logout (): Promise<void> {
    const htlid = this._user.htlid;
    this._user = undefined;
    this.user.next(this._user);
    if (!htlid) {
      return Promise.reject(new Error('No user logged in'));
    } else {
      return new Promise<void>( (resolve, reject) => {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        this.http.post(serverUrl + '/logout', { htlid: htlid }, options).toPromise()
          .then( response => {
            resolve();
          })
          .catch ( error =>  {
            console.log(error);
            reject(new Error('logout of ' + htlid + ' fails'));
          });
      });
    }
  }


  private handleError (err: any, reject: Function) {
    // debugger;
    console.log(err);
    let errMsg = '?';
    if (err instanceof Response) {
      const status = (err as Response).status;
      errMsg = status === 0 ? 'cannot connect server' : 'HTTP-Status ' + status;
    } else {
      errMsg = '?';
    }
    reject(new Error('login() fails (' + errMsg + ')'));
  }


  public login (htlid: string, password: string): Promise<IUser> {
    // return Promise.reject(new Error('not implemented yet'));
    return new Promise<IUser>( (resolve, reject) => {
       // debugger;
       const headersPost = new Headers({ 'Content-Type': 'application/json' });
       const optionsPost = new RequestOptions({ headers: headersPost });
       this.http.post(serverUrl + '/auth', { htlid: htlid, password: password}, optionsPost).toPromise()
        .then( responsePost => {
          // debugger;
          this._authResponse = responsePost.json();
          const headersGet = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this._authResponse.token
          });
          const optionsGet = new RequestOptions({ headers: headersGet });
          this.http.get(serverUrl + '/data/user', optionsGet).toPromise()
            .then( responseGet => {
              // debugger;
              this._user = (responseGet.json() as IUser);
              this.user.next(this._user);
              resolve(this._user);
            })
            .catch ( err => { this.handleError(err, reject)} );
        })
        .catch (err => { this.handleError(err, reject)});
    });
  }

}


export interface IUser {
  htlid: string;
  surname: string;
  firstname: string;
}
