import {Component, OnInit} from '@angular/core';
import {HousesService} from '../../services/house.service';
import {MapsAPILoader} from '@agm/core';
import {} from '@types/googlemaps';
import {ViewChild, ElementRef, NgZone} from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {
  private currentCity: string = '';
  private country: string = 'uk';
  private autocomplete: any;
  private predictionList: any;
  private selected: number = 0;
  private subscriptionGetShortCountr: any;
  private listCity: any;
  @ViewChild('search') private searchElement: ElementRef;


  constructor(private houseServise: HousesService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone) {
    this.subscriptionGetShortCountr = this.houseServise.getShortCountry().subscribe(
      data => this.setCountry(data));
  }

  public ngOnInit() {
    const returnObj = JSON.parse(localStorage.getItem('country'));
    if (returnObj !== null) {
      this.country = returnObj.language;
    }

    document.addEventListener('click', this.hideList);
    this.mapsAPILoader.load().then(() => {
      this.autocomplete = new google.maps.places.AutocompleteService;
      const returnCity = JSON.parse(localStorage.getItem('city'));
      if (returnCity !== null) {
        this.searchElement.nativeElement.value = returnCity;
        this.houseServise.sendCity(returnCity);
      }
    });
  }


  public showList(event): void {
    const listCity = document.querySelector('.prediction-list');
    listCity.classList.remove('hiddenSeach');
  }

  public hideList(e) {
    const listCity = document.querySelector('.prediction-list');
    if (!e.target.matches('.search-container, .search-container *')) {
      listCity.classList.add('hiddenSeach');
    }
  }

  public keyboardAutocomplete(event): void {
    if (event.keyCode === 13 && event.target.value !== '') {
      if (this.predictionList === null || this.predictionList.length === 0) {
        this.currentCity = event.target.value;
      } else {
        this.currentCity = this.predictionList[this.selected].structured_formatting.main_text;
      }
      const saveDtata = JSON.stringify(this.currentCity);
      localStorage.setItem('city', saveDtata);
      this.houseServise.savePage(1);
      event.target.value = this.currentCity;
      this.houseServise.sendCity(this.currentCity);
      this.selected = 0;
      this.predictionList = [];
      return;
    }

    if (event.keyCode === 40) {
      if (this.selected < this.predictionList.length - 1) {
        this.selected++;
        this.currentCity = this.predictionList[this.selected];
      }
    }

    if (event.keyCode === 38) {
      if (this.selected <= this.predictionList.length - 1 && this.selected > 0) {
        this.selected--;
      }
    }
    if (event.keyCode !== 38 && event.keyCode !== 40) {
      this.selected = 0;
    }

    this.currentCity = event.target.value || '';
    if (event.target.value) {

      this.autocomplete.getPlacePredictions({
        input: this.searchElement.nativeElement.value,
        types: ['(cities)'],
        componentRestrictions: {
          country: this.country
        }
      }, (res, status) => {

        this.ngZone.run(() => {
          this.predictionList = res;
        });
      });
    } else {
      this.predictionList = [];
    }
  }

  public onCityChange(city): void {
    this.currentCity = city.structured_formatting.main_text;
    const saveDtata = JSON.stringify(this.currentCity);
    localStorage.setItem('city', saveDtata);
    this.houseServise.savePage(1);
    this.houseServise.sendCity(this.currentCity);
    this.predictionList = [];
  }

  public setCountry(data): void {
    this.country = data;
    const searchElement = document.querySelector('.hiddenSeach');
    if (searchElement !== null) {
      searchElement.classList.remove('hiddenSeach');
      searchElement.classList.add('cities');
    }
    this.searchElement.nativeElement.value = null;
    this.predictionList = [];
  }
}
