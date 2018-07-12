import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

// Service
import { ConnectionQueueService } from '../../../@shared/service/connection_queue.service';
import { ConnectionQueueDataService } from '../@shared/services/connection_queue_data.service';

@Component({
  selector: 'app-queue-approve-table',
  templateUrl: './queue-approve-table.component.html',
  styleUrls: ['./queue-approve-table.component.scss']
})
export class QueueApproveTableComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _connectionQueueDataService: ConnectionQueueDataService,
    private _connectionQueueService: ConnectionQueueService) { }

  displayedColumns = [
    'queue',
    'east_port',
    'east_desc',
    'west_port',
    'west_desc',
    'action',
    'schedule',
    'requester',
    'approve',
    'status'
  ];
  dataSource: any = new MatTableDataSource();
  selected_east_port: number;
  selected_east_port_desc: string;
  is_refresh: boolean;
  operation_data: any;
  timerInterval: any;

  ngOnInit() {

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.fetchData();
    this._connectionQueueDataService.refresh_approve_queue_table.subscribe(data => this.is_refresh = data);
    this._connectionQueueDataService.current_operation.subscribe(data => this.operation_data = data);
    this.timerInterval = setInterval(() => {
      this.checkRefresh();
    }, 1000);

  }

  ngOnDestroy() {

    clearInterval(this.timerInterval);

  }

  fetchData() {

    this._connectionQueueService.getAprroveQueue().then(data => {
      this.dataSource.data = data;
    });

  }

  async checkRefresh() {

    if (this.is_refresh === true) {
      this.refresh();
      this._connectionQueueDataService.updateRefreshApproveQueue(false);
    }

  }

  delay(milliseconds: number) {

    return new Promise<void>(resolve => {
      setTimeout(resolve, milliseconds);
    });

  }


  refresh() {

    this._connectionQueueService.getAprroveQueue().then((data => {
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = data;
    }));

  }

}
