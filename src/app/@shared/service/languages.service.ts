import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Headers, Http, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
  export class languagesService {
   constructor(private _http: Http) {
        // this.getJSON().subscribe(data => {
        //     console.log(data)
        // });
    }

    public getLanguages() {
        const headers: any = new Headers({ 'Content-Type': 'application/json' });
        const options: any = new RequestOptions({ headers: headers });
        const return_object = [];

        console.log('inner get json service')
        return this._http.get("assets/languages/language.json", { headers: headers })
        .toPromise().then((response: any) => {
            const response_object = JSON.parse(response._body);
            // console.log(data);
            return response_object;
        })
    }

    // public ThaiLanguage() {
    //     const headers: any = new Headers({ 'Content-Type': 'application/json' });
    //     const options: any = new RequestOptions({ headers: headers });
    //     const return_object = [];

    //     console.log('inner get json service')
    //     return this._http.get("./../assets/thai.json", { headers: headers })
    //     .toPromise().then((response: any) => {
    //         const response_object = JSON.parse(response._body);
    //         // console.log(data);
    //         return response_object;
    //     })
    // }

    // public KoreaLanguage() {
    //     const headers: any = new Headers({ 'Content-Type': 'application/json' });
    //     const options: any = new RequestOptions({ headers: headers });
    //     const return_object = [];

    //     console.log('inner get json service')
    //     return this._http.get("./../assets/languages/korea.json", { headers: headers })
    //     .toPromise().then((response: any) => {
    //         const response_object = JSON.parse(response._body);
    //         // console.log(data);
    //         return response_object;
    //     })
    // }
  }