import {EventEmitter, Injectable, OnInit} from '@angular/core';
import {Jsonp, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class HousesService implements OnInit {


  eventWithModal: EventEmitter<any> = new EventEmitter();
  eventWithCountry: EventEmitter<any> = new EventEmitter();
  eventWithCiry: EventEmitter<any> = new EventEmitter();
  eventShorCountry: EventEmitter<any> = new EventEmitter();
  storejObject;
  standardURL: any = 'https://api.nestoria.co.uk/api';
  country: any = 'uk';
  city: any = 'brighton';

  ngOnInit(): void {
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

  savePage(page) {
    const savePage = JSON.stringify(page);
    localStorage.setItem('page', savePage);
  }


  saveDataForm(dataForm) {
    const saveDtata = JSON.stringify(dataForm);
    localStorage.setItem('formData', saveDtata);
  }

  selectButton(numButton) {
    const savePage = JSON.stringify(numButton);
    localStorage.setItem('radioButton', savePage);

  }

  selectCheckBox(chackStatus) {
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
