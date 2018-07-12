import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DataService {

    private east_portSource = new BehaviorSubject<number>(null);
    private west_portSource = new BehaviorSubject<number>(null);
    private east_portDescSource = new BehaviorSubject<string>(null);
    private west_portDescSource = new BehaviorSubject<string>(null);

    current_eastPort = this.east_portSource.asObservable();
    current_westPort = this.west_portSource.asObservable();
    current_eastDesc = this.east_portDescSource.asObservable();
    current_westDesc = this.west_portDescSource.asObservable();

    constructor() { }

    changeEastPort(east_port: number) {

        this.east_portSource.next(east_port);

    }

    changeWestPort(west_port: number) {

        this.west_portSource.next(west_port);

    }

    changeEastDesc(east_desc: string) {

        this.east_portDescSource.next(east_desc);

    }

    changeWestDesc(west_desc: string) {

        this.west_portDescSource.next(west_desc);

    }

}
