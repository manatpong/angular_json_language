import { Headers, Http, RequestOptions, ResponseContentType } from '@angular/http';
import { languagesService } from './../../@shared/service/languages.service';
import { CurrentConnectionService } from './../../@shared/service/current_connection.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import {MatSliderModule} from '@angular/material/slider';
import { DebuggingClearDatabaseComponent } from './debugging-clear-database.component';

import { DebuggingService } from '../../@shared/service/debugging.service';
import { MenuDataService } from '../../@shared/service/menu_data.service';
import { PortConnectionService } from '../../@shared/service/port-connection.service';

@Component({
  selector: 'app-debugging',
  templateUrl: './debugging.component.html',
  styleUrls: ['./debugging.component.scss'],
})
export class DebuggingComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private _debuggingService: DebuggingService,
    private _menuDataService: MenuDataService,
    private _portConnectionService: PortConnectionService,
    private _currentConnectionService: CurrentConnectionService,
    private _languageService: languagesService,
    private _http: Http,
  ) { }

  robot_model: string;
  normal_mode: boolean = false;
  simulate_mode: boolean = false;
  active_clear_database: boolean = false;
  random_round: number;
  formatLabel: number = 5;
  slider_value: number = 50;
  connect_prop: number = 100 - this.slider_value;
  random_con_round: number;
  act_condition: string;
  act_connect: boolean = true;
  act_disconnect: boolean = false;
  act_num_condition: number;

  debugging_page: any;
  get_language: any;
  

  ngOnInit() {

    this._menuDataService.updateSelectedMenu('debugging');
    this.fetchRobotMode();
    this.getLanguageDebugging();
  }

  fetchRobotMode() {

    this._debuggingService.getRobotMode().then((data) => {
      this.robot_model = data['model'];
      if (data['mode'] === 'Normal') {
        this.normal_mode = true;
        this.simulate_mode = false;
      } else {
        this.normal_mode = false;
        this.simulate_mode = true;
      }
    });

  }

  changeRobotMode(mode) {

    this._debuggingService.changeRobotMode(mode).then((data) => {
      this._debuggingService.fetchRobotMode(data['mode']);
      if (data['mode'] === 'Normal') {
        this.normal_mode = true;
        this.simulate_mode = false;
      } else {
        this.normal_mode = false;
        this.simulate_mode = true;
      }
    });

  }

  openDialogClearDatabase() {

    const dialog = this.dialog.open(DebuggingClearDatabaseComponent);

    dialog.afterClosed()
      .subscribe(result => {
        if (result === 'confirm') {
          this.clearDatabase();
        }
      });

  }

  async clearDatabase() {

    this.active_clear_database = false;
    this._portConnectionService.clearOperation('clear');
    await this.delay(2000);
    this._portConnectionService.clearOperation('clear');

  }

  delay(milliseconds: number) {

    return new Promise<void>(resolve => {
      setTimeout(resolve, milliseconds);
    });

  }

  async randomPort(action) {
    console.log(this.random_round,action)
    for(let i = 0; i < this.random_round; i++) {
      this._debuggingService.randomQueue(action);
      await this.delay(100);
    }
    alert('Random completed.')
  }

  changeCondition() {
        if (this.act_connect == false) {
          this.act_connect = true;
          this.act_disconnect = false;
        } else {
          this.act_connect = false;
          this.act_disconnect = true;
        }

  }

  slider_change() {
    this.connect_prop = 100 - this.slider_value
  }

  async randomWithCondition() {
    if(this.act_connect === true) {
      this.act_condition = 'connect';
    }
    else {
      this.act_condition = 'disconnect';
    }

    for(let i = 0; i < this.random_con_round; i++) {
      this._debuggingService.randomWithCon(this.act_condition,this.act_num_condition,this.slider_value);
      await this.delay(100);
    }
    alert('Random completed.')
    
    console.log(this.random_con_round,this.act_condition,this.act_num_condition,this.slider_value)
  }


  getLanguageDebugging() {
    this.get_language = localStorage.getItem('lang')
    this._languageService.getLanguages().then((data) => {
      this.debugging_page = data[this.get_language]['debugging'];
    })
  }

}
