import { Component } from '@angular/core';
import { sprintf } from 'sprintf-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'app';
  public createdAt: string;
  public name: string;
  public clickCnt = 0;
  public showTime = true;

  public constructor () {
    const now = new Date();
    this.createdAt = now.toLocaleDateString() + ' ' + now.toLocaleTimeString() + sprintf('.%03d', now.getMilliseconds());
  }

  public onClickMe () {
    console.log('clicked');
    this.clickCnt++;
    this.showTime = ! this.showTime;
  }

  public onName (value: string) {
    console.log(value);
    this.name = value;
  }

}
