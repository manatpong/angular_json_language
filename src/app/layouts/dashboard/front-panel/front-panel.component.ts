import { Component, OnInit } from '@angular/core';
import { DashboardDataService } from '../@shared/services/dashboard_data.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-front-panel',
  templateUrl: './front-panel.component.html',
  styleUrls: ['./front-panel.component.scss']
})
export class FrontPanelComponent implements OnInit {

  // FRONT PANEL
  first_row: object[] = _.chunk(_.range(1, 49), 4);
  second_row: object[] = _.chunk(_.range(49, 97), 4);
  third_row: object[] = _.chunk(_.range(97, 145), 4);
  unavailable_port: number[];
  connected_east_port: number[];
  connected_west_port: number[];
  operation_data: object;

  constructor(
    private _dashboardDataService: DashboardDataService) { }

  ngOnInit() {

    this._dashboardDataService.unavailable_port.subscribe(data => this.unavailable_port = data);
    this._dashboardDataService.connected_east_port.subscribe(data => this.connected_east_port = data);
    this._dashboardDataService.connected_west_port.subscribe(data => this.connected_west_port = data);
    this._dashboardDataService.current_operation.subscribe(data => this.operation_data = data);

  }

  isUnavailablePort(port_number: number) {

    if (this.unavailable_port === null || this.unavailable_port === undefined || !this.unavailable_port
      || this.unavailable_port['status'] === 'error') {
      return '';
    } else {
      return (this.unavailable_port.includes(port_number)) ? 'unavailable-port' : '';
    }

  }

  isConnectedEastPort(east_port: number) {

    if (this.connected_east_port === null || this.connected_east_port === undefined) {
      return '';
    } else {
      return (this.connected_east_port.includes(east_port)) ? 'connected-port' : '';
    }

  }

  isConnectedWestPort(west_port: number) {

    if (this.connected_west_port === null || this.connected_west_port === undefined) {
      return '';
    } else {
      return (this.connected_west_port.includes(west_port)) ? 'connected-port' : '';
    }

  }

  isOperationEast(east_port: number) {

    if (this.operation_data === null || this.operation_data === undefined) {
      return '';
    } else {
      return (this.operation_data['status'] !== 'Idle' && this.operation_data['east'] === east_port) ? 'operation-port' : '';
    }

  }

  isOperationWest(west_port: number) {

    if (this.operation_data === null || this.operation_data === undefined) {
      return '';
    } else {
      return (this.operation_data['status'] !== 'Idle' && this.operation_data['west'] === west_port) ? 'operation-port' : '';
    }

  }

}
