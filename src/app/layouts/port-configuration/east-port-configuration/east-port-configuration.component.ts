import { Component, OnInit } from '@angular/core';
import { DataService } from '../@shared/service/data.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-east-port-configuration',
  templateUrl: './east-port-configuration.component.html',
  styleUrls: ['./east-port-configuration.component.scss']
})
export class EastPortConfigurationComponent implements OnInit {


  constructor(private _dataService: DataService) { }

  // FRONT PANEL
  first_row: object[] = _.chunk(_.range(1, 49), 4);
  second_row: object[] = _.chunk(_.range(49, 97), 4);
  third_row: object[] = _.chunk(_.range(97, 145), 4);
  selected_east_port: number;
  east_desc: string[] = [];

  ngOnInit() {

    this.mockupDescription();
    this._dataService.current_eastPort.subscribe(selected_east_port => this.selected_east_port = selected_east_port);

  }

  mockupDescription() {

    for (let i = 1; i <= 144; i++) {

      this.east_desc.push('East port ' + i);

    }

  }

  pushEastDesc(port) {

    const index = port - 1;
    return this.east_desc[index];

  }

  isSelectedPort(east_port) {

    return (this.selected_east_port === east_port) ? 'selected' : '';

  }

  selectPort(event) {

    const east_port = Number(event.currentTarget.id);
    this._dataService.changeEastPort(east_port);
    this._dataService.changeEastDesc(this.east_desc[east_port - 1]);

  }

}
