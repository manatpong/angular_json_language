import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-system-memory-usage',
  templateUrl: './system-memory-usage.component.html',
  styleUrls: ['./system-memory-usage.component.scss']
})
export class SystemMemoryUsageComponent implements OnInit {

  constructor() { }

  // Doughnut
  public doughnutChartLabels: string[] = ['Memory Usage', 'Memory Free'];
  public doughnutChartData: number[] = [22, 78];
  public doughnutChartType: string = 'doughnut';
  public doughnutChartOptions = {
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const currentValue = dataset.data[tooltipItem.index];
          return currentValue + '%';
        }
      }
    }
  };
  public doughnutChartColors: any[] = [{ backgroundColor: ['#f50057', '#3f51b5' ] }];

  ngOnInit() {
  }

}
