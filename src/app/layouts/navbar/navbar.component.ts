import { languagesService } from './../../@shared/service/languages.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../../@shared/service/authentication.service';
import { DebuggingService } from '../../@shared/service/debugging.service';
import { MenuDataService } from '../../@shared/service/menu_data.service';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    private _router: Router,
    private _breakpointObserver: BreakpointObserver,
    private _authenticationService: AuthenticationService,
    private _debuggingService: DebuggingService,
    private _menuDataService: MenuDataService,
    private _languageService: languagesService) { }

  currentUser: object;
  current_robot_mode: string;
  selected_menu: string;
  assets_path: string = environment.assetsPath;
  enable_debug: boolean = environment.enableDebugging;
  isHandset: Observable<BreakpointState> = this._breakpointObserver.observe(Breakpoints.Handset);

  navbar_page: any;
  get_language: any;

  ngOnInit() {

    this._debuggingService.current_robot_mode_data.subscribe(data => this.current_robot_mode = data);
    this._authenticationService.current_user_data.subscribe(data => this.currentUser = data);
    this._menuDataService.current_seleted_menu.subscribe(data => this.selected_menu = data);
    this.fetchRobotMode();
    this.getLanguage();
  }

  fetchRobotMode() {

    this._debuggingService.getRobotMode().then((data) => {
      this._debuggingService.fetchRobotMode(data['mode']);
    });

  }

  selectMenu(event) {

    this.selected_menu = event.currentTarget.id;

  }

  logout() {

    localStorage.removeItem('userData');
    this._authenticationService.fetchUser(null);
    this.selected_menu = 'dashboard';
    this._router.navigate(['/login']);

  }

  getLanguage() {
    this.get_language = localStorage.getItem('lang')
    this._languageService.getLanguages().then((data) => {
      this.navbar_page = data[this.get_language]['navbar'];
    })
    console.log(this.get_language)
  }

  changeLanguage(language: string) {
    if(this.get_language != language) {
      localStorage.setItem('lang',language);
      this.getLanguage();
      window.location.reload();
    }
    else {
      localStorage.setItem('lang',language);
      this.getLanguage();
    }
  }

}
