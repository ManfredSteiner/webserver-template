
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-time',
  template: `
    <span>{{time}}</span>
  `,
  styles: [ `
    span {
      text-color: blue;
    }
  `]
})
export class TimeComponent implements OnInit, OnDestroy {
  public time: string;
  private _timerId: any;

  public constructor () {
    this.time = new Date().toLocaleTimeString();
  }

  public ngOnInit () {
    console.log('TimeComponent:ngOnInit()');
    this._timerId = setInterval(this.refreshTime.bind(this), 1000);
  }

  public ngOnDestroy () {
    console.log('TimeComponent:ngOnDestroy()');
    if (this._timerId) {
      clearInterval(this._timerId);
      this._timerId = undefined;
    }
  }

  private refreshTime () {
    this.time = new Date().toLocaleTimeString();
  }

}
