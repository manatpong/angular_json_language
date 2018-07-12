import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, ResponseContentType } from '@angular/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class DebuggingService {

    private ROOT_URL: string = environment.apiUrl;
    private robotModeData = new BehaviorSubject<string>(null);

    current_robot_mode_data = this.robotModeData.asObservable();

    constructor(private _http: Http) { }

    getRobotMode() {

        const headers: any = new Headers({ 'Content-Type': 'application/json' });
        const options: any = new RequestOptions({ headers: headers });

        return this._http.get(this.ROOT_URL + 'robot_mode/index.php', { headers: headers })
            .toPromise().then((response: any) => {
                const response_object = JSON.parse(response._body);

                return response_object;

            }).catch((error: any) => {

                if (error.status && error.status !== 0) {
                    console.error('POST CHANGE ROBOT MODE ERROR ' + error.status, Observable.throw(new Error(error.status)));

                } else {
                    console.error('POST CHANGE ROBOT MODE ERROR 500 Internal Server');
                }

            });

    }

    changeRobotMode(mode: number) {

        const headers: any = new Headers({ 'Content-Type': 'application/json' });
        const options: any = new RequestOptions({ headers: headers });
        const params = { 'mode': mode };

        return this._http.post(this.ROOT_URL + 'robot_mode/index.php', { headers: headers, params: params })
            .toPromise().then((response: any) => {
                const response_object = JSON.parse(response._body);

                return response_object;

            }).catch((error: any) => {

                if (error.status && error.status !== 0) {
                    console.error('POST CHANGE ROBOT MODE ERROR ' + error.status, Observable.throw(new Error(error.status)));

                } else {
                    console.error('POST CHANGE ROBOT MODE ERROR 500 Internal Server');
                }

            });
    }

    randomQueue(action: string) {
        const headers: any = new Headers({ 'Content-Type': 'application/json' });
        const options: any = new RequestOptions({ headers: headers });
        const params = { 'action': action };

        return this._http.post(this.ROOT_URL + 'random/index.php', { headers: headers, params: params })
            .toPromise().then((response: any) => {
                // const response_object = JSON.parse(response._body);

                // return response_object;
                console.log('call random');

            }).catch((error: any) => {

                if (error.status && error.status !== 0) {
                    console.error('POST CHANGE ROBOT MODE ERROR ' + error.status, Observable.throw(new Error(error.status)));

                } else {
                    console.error('POST CHANGE ROBOT MODE ERROR 500 Internal Server');
                }

            });
    }

    randomWithCon(act_condition: string, moreThanCon: number,prop_disconn: number) {
        const headers: any = new Headers({ 'Content-Type': 'application/json' });
        const options: any = new RequestOptions({ headers: headers });
        const params = { 'action': act_condition, 'condi': moreThanCon, 'prop': prop_disconn };

        return this._http.post(this.ROOT_URL + 'random/condition/index.php', { headers: headers, params: params })
            .toPromise().then((response: any) => {
                // const response_object = JSON.parse(response._body);

                // return response_object;
                console.log('call random condition');

            }).catch((error: any) => {

                if (error.status && error.status !== 0) {
                    console.error('POST CHANGE ROBOT MODE ERROR ' + error.status, Observable.throw(new Error(error.status)));

                } else {
                    console.error('POST CHANGE ROBOT MODE ERROR 500 Internal Server');
                }

            });
    }

    fetchRobotMode(robot_mode: string) {

        this.robotModeData.next(robot_mode);

    }

}
