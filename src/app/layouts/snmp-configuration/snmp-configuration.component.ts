import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Service
import { MenuDataService } from '../../@shared/service/menu_data.service';

// Environment
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-snmp-configuration',
  templateUrl: './snmp-configuration.component.html',
  styleUrls: ['./snmp-configuration.component.scss']
})
export class SnmpConfigurationComponent implements OnInit {

  constructor(
    private _menuDataService: MenuDataService,
    private router: Router) { }

  enable_auto_slide: boolean = environment.enableAutoSlide;

  ngOnInit() {

    this._menuDataService.updateSelectedMenu('snmp_configuration');
    this.autoRoute();

  }

  async autoRoute() {

    if (this.enable_auto_slide === true) {
      await this.delay(7000);
      this.router.navigate(['/system_configuration']);
    }

  }

  delay(ms: number) {

    return new Promise(resolve => setTimeout(resolve, ms));

  }

}
