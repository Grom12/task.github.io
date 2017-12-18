import {EventEmitter, Injectable, OnInit} from '@angular/core';
import {Jsonp, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class HousesService implements OnInit {
  private eventWithModal: EventEmitter<any> = new EventEmitter();
  private eventWithCountry: EventEmitter<any> = new EventEmitter();
  private eventWithCiry: EventEmitter<any> = new EventEmitter();
  private eventShorCountry: EventEmitter<any> = new EventEmitter();
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
    const returnObject = JSON.parse(localStorage.getItem('country'));
    if (returnObject !== null) {
      this.standardURL = returnObject.linked;
      this.country = returnObject.language;
    }
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
    customHouse.set('bedroom_min', objectHouse.bedrooMin);
    customHouse.set('bathroom_max', objectHouse.bathroomMax);
    customHouse.set('bathroom_min', objectHouse.bathroomMin);
    customHouse.set('has_photo', objectHouse.hasPhoto);
    customHouse.set('page', page);
    customHouse.set('callback', 'JSONP_CALLBACK');

    return this.jsonp.request(Url, {method: 'Get', search: customHouse}).map(response => {
      return response.json();
    });
  }

  public sendShortCountry(data) {
    this.eventShorCountry.emit(data);
  }

  public getShortCountry() {
    return this.eventShorCountry;
  }


  public sendDetailInfo(data) {
    this.eventWithModal.emit(data);
  }

  public getEventModal() {
    return this.eventWithModal;
  }

  public emitEvent2(data) {
    this.eventWithCountry.emit(data);
  }

  public getEventCountry() {
    return this.eventWithCountry;
  }

  public sendCity(data) {
    this.eventWithCiry.emit(data);
  }

  public getCity() {
    return this.eventWithCiry;
  }

  public savePage(page: any): void {
    const savePage = JSON.stringify(page);
    localStorage.setItem('page', savePage);
  }


  public saveDataForm(dataForm: any): void {
    const saveDtata = JSON.stringify(dataForm);
    localStorage.setItem('formData', saveDtata);
  }

  public selectButton(numButton: any): void {
    const savePage = JSON.stringify(numButton);
    localStorage.setItem('radioButton', savePage);

  }

  public selectCheckBox(chackStatus: any): void {
    const savePage = JSON.stringify(chackStatus);
    localStorage.setItem('checkbox', savePage);
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
