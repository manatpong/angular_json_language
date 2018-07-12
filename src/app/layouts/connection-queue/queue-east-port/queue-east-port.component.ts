import { Component, OnInit } from '@angular/core';
import { ConnectionQueueDataService } from '../@shared/services/connection_queue_data.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-queue-east-port',
  templateUrl: './queue-east-port.component.html',
  styleUrls: ['./queue-east-port.component.scss']
})
export class QueueEastPortComponent implements OnInit {

  constructor(
    private _connectionQueueDataService: ConnectionQueueDataService) { }

  first_row: object[] = _.range(1, 25);
  second_row: object[] = _.range(25, 49);
  third_row: object[] = _.range(49, 73);
  fourth_row: object[] = _.range(73, 97);
  fifth_row: object[] = _.range(97, 121);
  six_row: object[] = _.range(121, 145);
  current_selected_east: number;
  connected_port_data: object;
  operation_data: object;
  port_pair_data: object;
  connected_east_port: number[];
  east_description: string;
  unavailable_port: number[];
  pair_selected: number;

  ngOnInit() {

    this._connectionQueueDataService.unavailable_port.subscribe(data => this.unavailable_port = data);
    this._connectionQueueDataService.connected_east_port.subscribe(data => this.connected_east_port = data);
    this._connectionQueueDataService.connected_port.subscribe(data => this.connected_port_data = data);
    this._connectionQueueDataService.current_selected_east.subscribe(data => this.current_selected_east = data);
    this._connectionQueueDataService.current_selected_pair.subscribe(data => this.port_pair_data = data);
    this._connectionQueueDataService.east_port_desc.subscribe(data => this.east_description = data);
    this._connectionQueueDataService.current_operation.subscribe(data => this.operation_data = data);

  }

  pushDescription(east_port: number) {

    if (this.east_description === null || this.east_description === undefined || !this.east_description
      || this.east_description['status'] === 'error') {
      return '';
    } else {
      const index = east_port - 1;
      return this.east_description[index]['description'];
    }

  }

  pairDescription(east_port: number) {

    if (this.connected_port_data === null || this.connected_port_data === undefined || !this.connected_port_data
      || this.connected_port_data['status'] === 'error') {
      return '';

    } else {
      if (_.find(this.connected_port_data, ['east', east_port])) {
        const find_object = _.find(this.connected_port_data, ['east', east_port]);
        return 'Connect to ' + find_object['west_desc'];
      } else {
        return '';
      }
    }

  }

  isUnavailablePort(east_port: number) {

    if (this.unavailable_port === null || this.unavailable_port === undefined || !this.unavailable_port
      || this.unavailable_port['status'] === 'error') {
      return '';
    } else {
      return (this.unavailable_port.includes(east_port)) ? 'unavailable' : '';
    }

  }

  isPairSelected(east_port: number) {

    if (this.pair_selected === null || this.pair_selected === undefined) {
      return '';
    } else {
      return (this.pair_selected === east_port) ? 'pair-selected' : '';
    }

  }

  isPair(east_port: number) {

    if (this.port_pair_data === null || this.port_pair_data === undefined) {
      return '';
    } else {
      return (this.port_pair_data['east'] === east_port) ? 'pair' : '';
    }

  }

  isConnectedPort(east_port: number) {

    if (this.connected_east_port === null || this.connected_east_port === undefined) {
      return '';
    } else {
      return (this.connected_east_port.includes(east_port)) ? 'connected' : '';
    }

  }

  isOperation(east_port: number) {

    if (this.operation_data === null || this.operation_data === undefined) {
      return '';
    } else {
      return (this.operation_data['status'] !== 'Idle' && this.operation_data['east'] === east_port) ? 'operating' : '';
    }

  }

  isSelectedPort(east_port: number) {

    return (this.current_selected_east === east_port) ? 'selected' : '';

  }

  selectPort(event) {

    this.current_selected_east = Number(event.currentTarget.id);
    if (_.find(this.connected_port_data, ['east', this.current_selected_east])) {
      const find_object = _.find(this.connected_port_data, ['east', this.current_selected_east]);
      this._connectionQueueDataService.changePair({ 'east': find_object['east'], 'west': find_object['west'] }),
        this._connectionQueueDataService.changeSelectedEast(this.current_selected_east),
        this._connectionQueueDataService.changeActionType('disconnect'),
        this.pair_selected = find_object['east'];
    } else {
      this._connectionQueueDataService.changePair(null),
        this._connectionQueueDataService.changeSelectedEast(this.current_selected_east),
        this.pair_selected = null,
        this._connectionQueueDataService.changeActionType('connect');
    }

  }

}
