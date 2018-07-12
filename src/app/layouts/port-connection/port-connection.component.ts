import { languagesService } from './../../@shared/service/languages.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { EastPortComponent } from './east-port/east-port.component';
import { WestPortComponent } from './west-port/west-port.component';
import { Router } from '@angular/router';


// Service
import { PortConnectionDataService } from './@shared/service/port_connection_data.service';
import { PortConnectionService } from '../../@shared/service/port-connection.service';
import { PortService } from '../../@shared/service/port.service';
import { MenuDataService } from '../../@shared/service/menu_data.service';


// Third-porty
import * as _ from 'lodash';

// Environment
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-port-connection',
  templateUrl: './port-connection.component.html',
  styleUrls: ['./port-connection.component.scss']
})
export class PortConnectionComponent implements OnInit, OnDestroy {

  @ViewChild(EastPortComponent) _east;
  @ViewChild(WestPortComponent) _west;

  constructor(
    private _menuDataService: MenuDataService,
    private _portConnectionService: PortConnectionService,
    private _portDataService: PortConnectionDataService,
    private router: Router,
    private _portService: PortService,
    private _languageService: languagesService,
  ) { }

  enable_debug: boolean = environment.enableDebugging;
  enable_auto_slide: boolean = environment.enableAutoSlide;
  current_selected_east: number;
  current_selected_west: number;
  port_pair_data: object;
  operation_data: object;
  timerInterval: any;
  timerRouter: any;
  counttimeInterval: any;
  completion: number;
  operation_time: number;
  completion_time: number;
  action_type: string;

  get_language: any;
  port_connection_page: any;

  ngOnInit() {

    this._menuDataService.updateSelectedMenu('port_connection');
    this._portDataService.current_selected_east.subscribe(data => this.current_selected_east = data);
    this._portDataService.current_selected_west.subscribe(data => this.current_selected_west = data);
    this._portDataService.current_selected_pair.subscribe(data => this.port_pair_data = data);
    this._portDataService.current_operation.subscribe(data => this.operation_data = data);
    this._portDataService.current_operation_time.subscribe(data => this.operation_time = data);
    this.fetchUnavailablePort();
    this.fetchData();
    this.fetchOperation();
    this.fetchSequence();
    this.timerInterval = setInterval(() => {
      this.fecthConnectedPort(),
        this.fetchOperation(),
        this.fetchSequence();
    }, 1500);
    // this.timerRouter = setInterval(() => {
    this.autoRoute();
    // }, 10000);
    this.getLanguageDebugging();
  }

  async autoRoute() {

    if (this.enable_auto_slide === true) {
      await this.delay(7000);
      this.router.navigate(['/current_connection']);
    }

  }

  delay(ms: number) {

    return new Promise(resolve => setTimeout(resolve, ms));

  }


  ngOnDestroy() {

    clearInterval(this.timerInterval);
    clearInterval(this.timerRouter);

  }

  operationTimer() {

    if (this.operation_data['status'] !== 'Idle') {
      this._portDataService.updateOperationTime(this.operation_time + 1);
    }

  }

  fetchUnavailablePort() {

    this._portService.getUnavailablePort().then((unavailable_port_data) => {
      this._portDataService.fetchUnavailablePortData(unavailable_port_data);
    });

  }

  fecthConnectedPort() {

    this._portService.getConnectedPort().then((connected_port_data) => {
      this._portDataService.fetchPortData(connected_port_data),
        this._portDataService.fetchEastPortData(_.map(connected_port_data, 'east')),
        this._portDataService.fetchWestPortData(_.map(connected_port_data, 'west'));
    });

  }

  fetchData() {

    this._portService.getConnectedPort().then((connected_port_data) => {
      this._portDataService.fetchPortData(connected_port_data),
        this._portDataService.fetchEastPortData(_.map(connected_port_data, 'east')),
        this._portDataService.fetchWestPortData(_.map(connected_port_data, 'west')),
        this._portService.getEastDescription().then((data) => {
          this._portDataService.fetchEastPortDesc(data);
        }),
        this._portService.getWestDescription().then((data) => {
          this._portDataService.fetchWestPortDesc(data);
        });
    });

  }

  fetchOperation() {

    this._portService.getOperation().then((operation_data) => {
      this._portDataService.fetchOperation(operation_data),
        this.action_type = operation_data['action'],
        this.completion = Number(operation_data['progress']);
      this.completion_time = operation_data['operation_time'];
    });

  }

  fetchSequence() {

    if (this.operation_data && this.operation_data['status'] === 'Working') {
      this._portConnectionService.getSequences().then((sequence_data) => {
        this._portDataService.fetchSequence(sequence_data);
      });
    }

  }

  isActiveConnectStatus() {

    if (this._east.unlock_connect_button === true && this._west.unlock_connect_button === true
      && this.current_selected_east && this.current_selected_west) {
      return 'active-status';
    } else {
      return 'unactive-status';
    }

  }

  isActiveDisconnectStatus() {

    if (this.port_pair_data && this.current_selected_east && this.current_selected_west) {
      if (this.port_pair_data['east'] === this.current_selected_east && this.port_pair_data['west'] === this.current_selected_west) {
        return 'active-status';
      } else {
        return 'unactive-status';
      }
    } else {
      return 'unactive-status';
    }

  }

  unlockConnect() {

    if (this._east.unlock_connect_button === true && this._west.unlock_connect_button === true
      && this.current_selected_east && this.current_selected_west) {
      return true;
    } else if (this._east.unlock_connect_button === false || this._west.unlock_connect_button === false) {
      return false;
    } else {
      return false;
    }

  }

  unlockDisconnect() {

    if (this.port_pair_data && this.current_selected_east && this.current_selected_west) {
      if (this.port_pair_data['east'] === this.current_selected_east && this.port_pair_data['west'] === this.current_selected_west) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

  }

  createConnect() {

    this._portConnectionService.createConnection(this.current_selected_east, this.current_selected_west, 'connect', 'admin'),
      this._portDataService.changeSelectedEast(null),
      this._portDataService.changeSelectedWest(null),
      this._east.pair_selected = null,
      this._west.pair_selected = null,
      this._portDataService.changePair(null);
    // this._portDataService.updateOperationTime(0);

  }

  createDisconnect() {

    this._portConnectionService.createConnection(this.current_selected_east, this.current_selected_west, 'disconnect', 'admin'),
      this._portDataService.changeSelectedEast(null),
      this._portDataService.changeSelectedWest(null),
      this._east.pair_selected = null,
      this._west.pair_selected = null,
      this._portDataService.changePair(null);
    // this._portDataService.updateOperationTime(0);

  }

  // changeLanguage(language: string) {
  //   this._languageService.getLanguages().then((data) => {
  //     this.port_connection_page = data[language]['debugging'];
  //   })
  //   localStorage.setItem('lang',language);
  //   this.getLanguageDebugging();
  // }

  getLanguageDebugging() {
    this.get_language = localStorage.getItem('lang')
    this._languageService.getLanguages().then((data) => {
      this.port_connection_page = data[this.get_language]['port_connection'];
    })
  }

}
