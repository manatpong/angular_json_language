import { languagesService } from './../../../@shared/service/languages.service';
import { Component, OnInit } from '@angular/core';
import { DashboardDataService } from '../@shared/services/dashboard_data.service';
import { ConnectionHistoryService } from '../../../@shared/service/connection_history.service';


@Component({
  selector: 'app-operation-and-connection-log',
  templateUrl: './operation-and-connection-log.component.html',
  styleUrls: ['./operation-and-connection-log.component.scss']
})
export class OperationAndConnectionLogComponent implements OnInit {

  constructor(
    private _dashboardDataService: DashboardDataService,
    private _connectionHistoryService: ConnectionHistoryService,
    private _languageService: languagesService) { }

  operation_data: object;
  connection_history_data: object[] = [];

  operation_and_conenct_log: any;
  get_language: any;

  ngOnInit() {

    this._dashboardDataService.current_operation.subscribe(data => this.operation_data = data);
    this.fetchConnectionHistory();
    this.getLanguage();
  }

  fetchConnectionHistory() {

    this._connectionHistoryService.getConnectionHistory().then((data) => {
      if (data['status'] === 'error') {
        return;
      } else {
        for (let i = 0; i < 20; i++) {
          this.connection_history_data.push({
            'timestamp': data[i]['timestamp'].toString().substring(0, 31),
            'east': data[i]['east'],
            'west': data[i]['west']
          });
        }
      }
    });

  }

  getLanguage() {
    this.get_language = localStorage.getItem('lang')
    this._languageService.getLanguages().then((data) => {
      this.operation_and_conenct_log = data[this.get_language]['dashboard']['operation_connection_log_comp'];
    })
  }

}
