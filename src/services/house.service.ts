import {EventEmitter, Injectable, OnInit} from '@angular/core';
import {Jsonp, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HousesService implements OnInit {
  private eventWithModal: EventEmitter<any> = new EventEmitter();
  private eventWithCountry: EventEmitter<any> = new EventEmitter();
  private eventWithCity: EventEmitter<any> = new EventEmitter();
  private eventShortCountry: EventEmitter<any> = new EventEmitter();
  public standardURL: any = 'https://api.nestoria.co.uk/api';
  public country: any = 'uk';
  public city: any = 'brighton';

  public ngOnInit(): void {
    const returnObject = JSON.parse(localStorage.getItem('country'));
    if (returnObject !== null) {
      this.standardURL = returnObject.linked;
      this.country = returnObject.language;
    }
  }

  constructor(private jsonp: Jsonp) {
  }

  public getHouse(page, objectHouse) {
    let Url;
    if (objectHouse.country === undefined) {
      Url = this.standardURL;
    } else {
      Url = objectHouse.country;
    }

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
    customHouse.set('bedroom_min', objectHouse.bedroomMin);
    customHouse.set('bathroom_max', objectHouse.bathroomMax);
    customHouse.set('bathroom_min', objectHouse.bathroomMin);
    customHouse.set('has_photo', objectHouse.hasPhoto);
    customHouse.set('page', page);
    customHouse.set('callback', 'JSONP_CALLBACK');

    return this.jsonp.request(Url, {method: 'Get', search: customHouse}).map(response => {
      return response.json();
    });
  }

  public sendData(data, nameEventEmit) {
    this[nameEventEmit].emit(data);
  }

  public getData(nameEventEmit) {
    return this[nameEventEmit];
  }

  public saveDataInStorage(data: any, nameKey: string) {
    const saveData = JSON.stringify(data);
    localStorage.setItem(nameKey, saveData);
  }

  public setFavor(containHouses: any): void {
    const returnObj = JSON.parse(localStorage.getItem('object'));
    for (const house of containHouses) {
      for (const keys in returnObj) {
        if (keys === house.lister_url) {
          house.setFavorites = 'starEmpty';
        }
      }
    }
  }
}
