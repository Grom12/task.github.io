import {EventEmitter, Injectable} from '@angular/core';
import {Jsonp, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class HousesService {
  eventWithModal: EventEmitter<any> = new EventEmitter();
  eventWithCountry: EventEmitter<any> = new EventEmitter();
  eventWithCiry: EventEmitter<any> = new EventEmitter();
  eventShorCountry: EventEmitter<any> = new EventEmitter();
  standardURL: any = 'https://api.nestoria.co.uk/api';
  country: any = 'uk';
  city: any = 'brighton';


  constructor(private jsonp: Jsonp) {
  }


  public getHouse(page, objectHouse) {
    let Url;
    if (objectHouse.country === undefined) {
      Url = this.standardURL;
    } else Url = objectHouse.country;


    if (objectHouse.city === undefined) {
      objectHouse.city = this.city;
    }

    const customHouse = new URLSearchParams();
    customHouse.set('encoding', 'json');
    customHouse.set('pretty', '1');
    customHouse.set('action', 'search_listings');
    customHouse.set('listing_type', objectHouse.typelist);
    customHouse.set('place_name', objectHouse.city);
    customHouse.set('price_min', objectHouse.minPrice);
    customHouse.set('price_max', objectHouse.maxPrice);
    customHouse.set('bedroom_max', objectHouse.bedroomMax);
    customHouse.set('bathroom_max', objectHouse.bathroomMax);
    customHouse.set('bathroom_min', objectHouse.bathroomMin);
    customHouse.set('has_photo', objectHouse.hasPhoto);
    customHouse.set('page', page);
    customHouse.set('callback', 'JSONP_CALLBACK');


    return this.jsonp.request(Url, {method: 'Get', search: customHouse}).map(response => {
      return response.json();
    });

  }


  sendShortCountry(data) {
    this.eventShorCountry.emit(data);
  }

  getShortCountry() {
    return this.eventShorCountry;
  }


  sendDetailInfo(data) {
    this.eventWithModal.emit(data);
  }

  getEventModal() {
    return this.eventWithModal;
  }

  emitEvent2(data) {
    this.eventWithCountry.emit(data);
  }

  getEventCountry() {
    return this.eventWithCountry;
  }

  sendCity(data) {
    this.eventWithCiry.emit(data);
  }

  getCity() {
    return this.eventWithCiry;
  }


  public setFavor(containHouses: any): void {
    const returnObj = JSON.parse(localStorage.getItem('object'));
    for (const house of containHouses) {
      for (const keys in returnObj) {
        if (keys === house.lister_url) {
          house.setFavorites = 'star2';
        }
      }
    }
  }
}
