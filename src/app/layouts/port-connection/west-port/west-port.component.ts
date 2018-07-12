import { Component, OnInit, Input } from '@angular/core';
import { PortConnectionDataService } from '../@shared/service/port_connection_data.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-west-port',
  templateUrl: './west-port.component.html',
  styleUrls: ['./west-port.component.scss']
})
export class WestPortComponent implements OnInit {

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
  connected_west_port: number[];
  current_selected_east: number;
  current_selected_west: number;
  west_description: string[];
  unavailable_port: number[];

  ngOnInit() {

    this.unlock_connect_button = false;
    this.unlock_disconnect_button = false;
    this._portDataService.unavailable_port.subscribe(data => this.unavailable_port = data);
    this._portDataService.connected_west_port.subscribe(data => this.connected_west_port = data);
    this._portDataService.connected_port.subscribe(data => this.connected_port_data = data);
    this._portDataService.current_selected_east.subscribe(data => this.current_selected_east = data);
    this._portDataService.current_selected_west.subscribe(data => this.current_selected_west = data);
    this._portDataService.current_selected_pair.subscribe(data => this.port_pair_data = data);
    this._portDataService.west_port_desc.subscribe(data => this.west_description = data);
    this._portDataService.current_operation.subscribe(data => this.operation_data = data);

  }

  lockPortPanel() {

    return (this.operation_data && this.operation_data['status'] !== 'Idle' ) ? 'lock-panel' : '';

  }

  hideSpinner() {

    return (this.operation_data && this.operation_data['status'] !== 'Idle') ? '' : 'hide-spinner';

  }

  pushDescription(west_port: number) {

    if (this.west_description === null || this.west_description === undefined || !this.west_description
      || this.west_description['status'] === 'error') {
      return '';
    } else {
      const index = west_port - 1;
      return this.west_description[index]['description'];
    }

  }

  pairDescription(west_port: number) {

    if (this.connected_port_data === null || this.connected_port_data === undefined || !this.connected_port_data
      || this.connected_port_data['status'] === 'error') {
      return '';

    } else {
      if (_.find(this.connected_port_data, ['west', west_port])) {
        const find_object = _.find(this.connected_port_data, ['west', west_port]);
        return 'Connect to ' + find_object['east_desc'];
      } else {
        return '';
      }
    }

  }

  isPairSelected(west_port: number) {

    if (this.pair_selected === null || this.pair_selected === undefined) {
      return '';
    } else {
      return (this.pair_selected === west_port) ? 'pair-selected' : '';
    }

  }

  isPair(west_port: number) {

    if (this.port_pair_data === null || this.port_pair_data === undefined) {
      return '';
    } else {
      return (this.port_pair_data['west'] === west_port) ? 'pair' : '';
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


  isConnectedPort(west_port: number) {

    if (this.connected_west_port === null || this.connected_west_port === undefined) {
      return '';
    } else {
      return (this.connected_west_port.includes(west_port)) ? 'connected' : '';
    }

  }

  isOperation(west_port: number) {

    if (this.operation_data === null || this.operation_data === undefined) {
      return '';
    } else {
      return (this.operation_data['status'] !== 'Idle' && this.operation_data['west'] === west_port) ? 'operating' : '';
    }

  }

  isSelectedPort(west_port) {

    return (this.current_selected_west === west_port) ? 'selected' : '';

  }

  selectPort(event) {

    this.current_selected_west = Number(event.currentTarget.id);

    if (_.find(this.connected_port_data, ['west', this.current_selected_west])) {
      const find_object = _.find(this.connected_port_data, ['west', this.current_selected_west]);
      this._portDataService.changePair({ 'east': find_object['east'], 'west': find_object['west'] }),
        this._portDataService.changeSelectedWest(this.current_selected_west),
        this.pair_selected = this.current_selected_west,
        this.unlock_connect_button = false;
    } else {
      this._portDataService.changePair(null),
        this.pair_selected = null,
        this.unlock_disconnect_button = false,
        this.unlock_connect_button = true,
        this._portDataService.changeSelectedWest(this.current_selected_west);
    }

  }

}
