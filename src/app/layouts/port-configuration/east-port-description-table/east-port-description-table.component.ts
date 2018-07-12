import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DataService } from '../@shared/service/data.service';

@Component({
  selector: 'app-east-port-description-table',
  templateUrl: './east-port-description-table.component.html',
  styleUrls: ['./east-port-description-table.component.scss']
})
export class EastPortDescriptionTableComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _dataService: DataService) { }

  displayedColumns = ['east_port', 'east_desc'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  selected_east_port: number;
  selected_east_port_desc: string;

  ngOnInit() {

    this.mockupDescription();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this._dataService.current_eastPort.subscribe(selected_east_port => this.selected_east_port = selected_east_port);
    this._dataService.current_eastDesc.subscribe(selected_east_port_desc => this.selected_east_port_desc = selected_east_port_desc);

  }

  changeSelectedEastPort() {

    this._dataService.changeEastPort(this.selected_east_port);

  }

  changeSelectedEastPortDesc() {

    this._dataService.changeEastDesc(this.selected_east_port_desc);

  }

  mockupDescription() {

    for (let i = 1; i <= 144; i++) {

      ELEMENT_DATA.push({ east_port: i, east_desc: 'East port ' + i });

    }

  }

}

export interface PeriodicElement {
  east_port: number;
  east_desc: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];
