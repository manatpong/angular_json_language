import { Component, OnInit } from '@angular/core';
import { DataService } from '../@shared/service/data.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-west-port-configuration',
  templateUrl: './west-port-configuration.component.html',
  styleUrls: ['./west-port-configuration.component.scss']
})
export class WestPortConfigurationComponent implements OnInit {


  constructor(private _dataService: DataService) { }

  // FRONT PANEL
  first_row: object[] = _.chunk(_.range(1, 49), 4);
  second_row: object[] = _.chunk(_.range(49, 97), 4);
  third_row: object[] = _.chunk(_.range(97, 145), 4);
  selected_west_port: number;
  west_desc: string[] = [];

  ngOnInit() {

    this.mockupDescription();
    this._dataService.current_westPort.subscribe(selected_west_port => this.selected_west_port = selected_west_port);

  }

  mockupDescription() {

    for (let i = 1; i <= 144; i++) {

      this.west_desc.push('West port ' + i);

    }

  }

  pushWestDesc(port) {

    const index = port - 1;
    return this.west_desc[index];

  }

  isSelectedPort(east_port) {

    return (this.selected_west_port === east_port) ? 'selected' : '';

  }

  selectPort(event) {

    const west_port = Number(event.currentTarget.id);
    this._dataService.changeWestPort(west_port);
    this._dataService.changeWestDesc(this.west_desc[west_port - 1]);

  }

}
