import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

// Service
import { ConnectionHistoryService } from '../../@shared/service/connection_history.service';
import { MenuDataService } from '../../@shared/service/menu_data.service';

// Third-party
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import * as _ from 'lodash';

// Environment
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-connection-history',
  templateUrl: './connection-history.component.html',
  styleUrls: ['./connection-history.component.scss']
})
export class ConnectionHistoryComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _menuDataService: MenuDataService,
    private router: Router,
    private _connectionHistoryService: ConnectionHistoryService) { }

  displayedColumns = [
    'action',
    'east',
    'east_desc',
    'east_count',
    'west',
    'west_desc',
    'west_count',
    'username',
    'status',
    'timestamp'
  ];
  enable_auto_slide: boolean = environment.enableAutoSlide;
  dataSource: any = new MatTableDataSource();
  data = [];

  ngOnInit() {

    this._menuDataService.updateSelectedMenu('connection_history');
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.fetchData();
    this.autoRoute();

  }

  async autoRoute() {

    if (this.enable_auto_slide === true) {
      await this.delay(7000);
      this.router.navigate(['/snmp_configuration']);
    }

  }

  delay(ms: number) {

    return new Promise(resolve => setTimeout(resolve, ms));

  }

  fetchData() {

    this._connectionHistoryService.getConnectionHistory().then((data) => {
      if (data['status'] === 'error') {
        return;
      } else {
        this.dataSource.data = data;
      }
    });

  }

  exportCSV() {

    const filename = 'Connection_history';
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      useBom: true,
      noDownload: false,
      headers: [
        'Action',
        'East',
        'East Description',
        'East Count',
        'West',
        'West Description',
        'West Count',
        'Username',
        'Status',
        'Timestamp'
      ]
    };

    const export_file = new Angular5Csv(this.dataSource.data, filename, options);

  }

}
