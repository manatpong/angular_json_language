import { Component, OnInit, ViewChild, Input } from '@angular/core';

// Service
import { DashboardDataService } from '../@shared/services/dashboard_data.service';

// Third-porty
import * as _ from 'lodash';
import { BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'app-total-connection',
  templateUrl: './total-connection.component.html',
  styleUrls: ['./total-connection.component.scss']
})
export class TotalConnectionComponent implements OnInit {

  @ViewChild(BaseChartDirective)
  public chart: BaseChartDirective;

  @Input() available_port: number;

  constructor(
    private _dashboardDataService: DashboardDataService) { }

  unavailable_port: number[];
  connected_port: object;

  // Pie chart
  isDataAvailable: boolean = false;
  pieChartLabels: string[] = ['Available', 'Unavailable', 'Connected'];
  pieChartData: number[] = [];
  pieChartType: string = 'pie';
  pieChartOptions: any = {
    legend: {
      labels: {
        fontColor: 'black'
      }
    }
  };
  pieChartColors: any[] = [{ backgroundColor: ['#22c917', '#bdbdbd', '#f50057'] }];

  ngOnInit() {

    this._dashboardDataService.unavailable_port.subscribe(data => this.unavailable_port = data);
    this._dashboardDataService.connected_port.subscribe(data => this.connected_port = data);
    this.asyncAwait();

  }

  async asyncAwait() {

    await this.delay(1000);
    this.pushChartData();
    this.chartReady();

  }

  delay(ms: number) {

    return new Promise<void>(function (resolve) {
      setTimeout(resolve, ms);
    });

  }

  async pushChartData() {

    if (this.unavailable_port === null) {
      if (this.connected_port === null) {
        this.pieChartData.push(144);
        this.pieChartData.push(0);
        this.pieChartData.push(0);
        this.available_port = 144;
      } else {
        this.pieChartData.push(144 - _.size(this.connected_port));
        this.pieChartData.push(0);
        this.pieChartData.push(_.size(this.connected_port));
        this.available_port = 144 + _.size(this.connected_port);
      }
    } else {
      if (this.connected_port === null) {
        this.pieChartData.push(144 - this.unavailable_port.length);
        this.pieChartData.push(this.unavailable_port.length);
        this.pieChartData.push(0);
        this.available_port = 144 - (_.size(this.unavailable_port));
      } else {
        this.pieChartData.push(144 - (_.size(this.unavailable_port) + _.size(this.connected_port)));
        this.pieChartData.push(_.size(this.unavailable_port));
        this.pieChartData.push(_.size(this.connected_port));
        this.available_port = 144 - (_.size(this.unavailable_port) + _.size(this.connected_port));
      }
    }

  }

  async chartReady() {

    this.isDataAvailable = true;

  }

}
