import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DataService } from '../@shared/service/data.service';

import { Angular5Csv } from 'angular5-csv/Angular5-csv';

@Component({
  selector: 'app-west-port-description-table',
  templateUrl: './west-port-description-table.component.html',
  styleUrls: ['./west-port-description-table.component.scss']
})
export class WestPortDescriptionTableComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _dataService: DataService) { }

  displayedColumns = ['west_port', 'west_desc'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  selected_west_port: number;
  selected_west_port_desc: string;

  ngOnInit() {

    this.mockupDescription();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this._dataService.current_westPort.subscribe(selected_west_port => this.selected_west_port = selected_west_port);
    this._dataService.current_westDesc.subscribe(selected_west_port_desc => this.selected_west_port_desc = selected_west_port_desc);

  }

  changeSelectedWestPort() {

    this._dataService.changeWestPort(this.selected_west_port);

  }

  changeSelectedWestPortDesc() {

    this._dataService.changeWestDesc(this.selected_west_port_desc);

  }

  mockupDescription() {

    for (let i = 1; i <= 144; i++) {

      ELEMENT_DATA.push({ west_port: i, west_desc: 'West port ' + i });

    }

  }

  exportCSV() {

    const filename = 'West_Port_Description';
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      useBom: true,
      noDownload: false,
      headers: [
        'West Port',
        'Port Description',
      ],
    };
    const export_file = new Angular5Csv(ELEMENT_DATA, filename, options);

  }

}

export interface PeriodicElement {
  west_port: number;
  west_desc: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];
