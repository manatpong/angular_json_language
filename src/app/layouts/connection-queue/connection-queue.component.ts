import { languagesService } from './../../@shared/service/languages.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

// Service
import { PortService } from '../../@shared/service/port.service';
import { ConnectionQueueDataService } from './@shared/services/connection_queue_data.service';
import { ConnectionQueueService } from '../../@shared/service/connection_queue.service';
import { MenuDataService } from '../../@shared/service/menu_data.service';

// Third-porty
import * as _ from 'lodash';

// Environment
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-connection-queue',
  templateUrl: './connection-queue.component.html',
  styleUrls: ['./connection-queue.component.scss']
})
export class ConnectionQueueComponent implements OnInit, OnDestroy {

  constructor(
    private _menuDataService: MenuDataService,
    private router: Router,
    private _portService: PortService,
    private _connectionQueueDataService: ConnectionQueueDataService,
    private _connectionQueueService: ConnectionQueueService,
    private _languageService: languagesService) { }

  enable_auto_slide: boolean = environment.enableAutoSlide;
  timerInterval: any;
  completion: number;
  completion_time: number;
  operation_data: object;
  action_type: string;

  connection_queue_page: any;
  get_language: any;

  ngOnInit() {

    this.fetchUnavailablePort();
    this.fetchData();
    this.fetchOperation();
    this.timerInterval = setInterval(() => {
      this.fecthConnectedPort(),
        this.fetchOperation();
    }, 1000);
    this.fetchQueue();
    this._connectionQueueDataService.current_operation.subscribe(data => this.operation_data = data);
    this.autoRoute();
    this._menuDataService.updateSelectedMenu('connection_queue');
    this.getLanguage();
  }

  ngOnDestroy() {

    clearInterval(this.timerInterval);

  }

  async autoRoute() {

    if (this.enable_auto_slide === true) {
      await this.delay(15000);
      this.router.navigate(['/current_connection']);
    }

  }

  delay(ms: number) {

    return new Promise(resolve => setTimeout(resolve, ms));

  }

  fetchUnavailablePort() {

    this._portService.getUnavailablePort().then((unavailable_port_data) => {
      this._connectionQueueDataService.fetchUnavailablePortData(unavailable_port_data);
    });

  }

  fecthConnectedPort() {

    this._portService.getConnectedPort().then((connected_port_data) => {
      this._connectionQueueDataService.fetchPortData(connected_port_data),
        this._connectionQueueDataService.fetchEastPortData(_.map(connected_port_data, 'east')),
        this._connectionQueueDataService.fetchWestPortData(_.map(connected_port_data, 'west'));
    });

  }

  fetchData() {

    this._portService.getConnectedPort().then((connected_port_data) => {
      this._connectionQueueDataService.fetchPortData(connected_port_data),
        this._connectionQueueDataService.fetchEastPortData(_.map(connected_port_data, 'east')),
        this._connectionQueueDataService.fetchWestPortData(_.map(connected_port_data, 'west')),
        this._portService.getEastDescription().then((data) => {
          this._connectionQueueDataService.fetchEastPortDesc(data);
        }),
        this._portService.getWestDescription().then((data) => {
          this._connectionQueueDataService.fetchWestPortDesc(data);
        });
    });

  }

  fetchQueue() {

    this._connectionQueueService.getQueue().then(data => {
      this._connectionQueueDataService.fetchQueue(data);
    });

  }

  fetchApproveQueue() {

    this._connectionQueueService.getAprroveQueue().then(data => {
      this._connectionQueueDataService.fetchApproveQueue(data);
    });

  }

  fetchOperation() {

    this._portService.getOperation().then((operation_data) => {
      if (operation_data['progress'] === '100') {
        this._connectionQueueDataService.updateRefreshApproveQueue(true);
      }
      this._connectionQueueDataService.fetchOperation(operation_data),
        this.action_type = operation_data['action'],
        this.completion = Number(operation_data['progress']),
        this.completion_time = operation_data['operation_time'];
    });

  }

  getLanguage() {
    this.get_language = localStorage.getItem('lang')
    this._languageService.getLanguages().then((data) => {
      this.connection_queue_page = data[this.get_language]['connection_queue'];
      console.log(this.connection_queue_page)
    })
  }

}
