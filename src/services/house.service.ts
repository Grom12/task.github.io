import {EventEmitter, Injectable} from '@angular/core';
import {Jsonp, URLSearchParams} from '@angular/http';


import 'rxjs/add/operator/map';
import {domens} from '../constants/links';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class HousesService {
  myevent: EventEmitter<any> = new EventEmitter();
  houseobj: any = {};

  constructor(private jsonp: Jsonp) {
  }

  public getHouseFromCity() {
    const Url = 'https://api.nestoria.com.br/api?encoding=json&pretty=1&action=search_listings&country=br&listing_type=buy&place_name=brasilia';
    let obj = {};
    console.log('entered');
    const params = new URLSearchParams();
    params.set('callback', 'JSONP_CALLBACK');

    return this.jsonp
      .request(Url, {method: 'Get', search: params}).map(response => {
        obj = response.json();
        this.houseobj = obj;
        return response.json();
      });
  }


  emitEvent(data) {
    this.myevent.emit(data);
  }

  getEvent() {
    return this.myevent;
  }

  public setFavor(containHouses: any): void {
    for (const house of containHouses) {
      for (const title in localStorage) {
        if (house.title === title) {
          house.setFavorites = 'star2';
        }
      }
    }
  }


}
