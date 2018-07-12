import { Component, OnInit, Input } from '@angular/core';
import { PortConnectionDataService } from '../@shared/service/port_connection_data.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-east-port',
  templateUrl: './east-port.component.html',
  styleUrls: ['./east-port.component.scss']
})
export class EastPortComponent implements OnInit {

  @Input() unlock_connect_button: boolean;
  @Input() unlock_disconnect_button: boolean;
  @Input() pair_selected: number;

  constructor(
    private _portDataService: PortConnectionDataService) { }

  first_row: object[] = _.range(1, 25);
  second_row: object[] = _.range(25, 49);
  third_row: object[] = _.range(49, 73);
  fourth_row: object[] = _.range(73, 97);
  fifth_row: object[] = _.range(97, 121);
  six_row: object[] = _.range(121, 145);
  connected_port_data: object;
  operation_data: object;
  port_pair_data: object;
  connected_east_port: number[];
  current_selected_east: number;
  current_selected_west: number;
  east_description: string;
  unavailable_port: number[];

  ngOnInit() {
    console.log(this.first_row,'this is first row');
    this.unlock_connect_button = false;
    this.unlock_disconnect_button = false;
    this._portDataService.unavailable_port.subscribe(data => this.unavailable_port = data);
    this._portDataService.connected_east_port.subscribe(data => this.connected_east_port = data);
    this._portDataService.connected_port.subscribe(data => this.connected_port_data = data);
    this._portDataService.current_selected_east.subscribe(data => this.current_selected_east = data);
    this._portDataService.current_selected_west.subscribe(data => this.current_selected_west = data);
    this._portDataService.current_selected_pair.subscribe(data => this.port_pair_data = data);
    this._portDataService.east_port_desc.subscribe(data => this.east_description = data);
    this._portDataService.current_operation.subscribe(data => this.operation_data = data);

  }

  lockPortPanel() {

    return (this.operation_data && this.operation_data['status'] !== 'Idle' ) ? 'lock-panel' : '';

  }

  hideSpinner() {

    return (this.operation_data && this.operation_data['status'] !== 'Idle') ? '' : 'hide-spinner';

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

  isUnavailablePort(east_port: number) {

    if (this.unavailable_port === null || this.unavailable_port === undefined || !this.unavailable_port
      || this.unavailable_port['status'] === 'error') {
      return '';
    } else {
      return (this.unavailable_port.includes(east_port)) ? 'unavailable' : '';
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
      this._portDataService.changePair({ 'east': find_object['east'], 'west': find_object['west'] }),
        this._portDataService.changeSelectedEast(this.current_selected_east),
        this.pair_selected = this.current_selected_east,
        this.unlock_connect_button = false;
    } else {
      this._portDataService.changePair(null),
        this.pair_selected = null,
        this.unlock_disconnect_button = false,
        this.unlock_connect_button = true,
        this._portDataService.changeSelectedEast(this.current_selected_east);
    }

  }

}
