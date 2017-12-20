import {Component, OnInit} from '@angular/core';
import {HousesService} from '../../services/house.service';
import {MapsAPILoader} from '@agm/core';
import {} from '@types/googlemaps';
import {ViewChild, ElementRef, NgZone} from '@angular/core';

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
  private subscriptionGetShortCounter: any;
  private showSearch: boolean = false;
  public visibility: boolean = true;

  @ViewChild('search') private searchElement: ElementRef;

  constructor(private houseServise: HousesService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone) {

    this.subscriptionGetShortCounter = this.houseServise.getShortCountry().subscribe(
      data => this.setCountry(data));
  }

  public ngOnInit(): void {
    const returnObj = JSON.parse(localStorage.getItem('country'));
    if (returnObj) {
      this.country = returnObj.language;
    }

    document.addEventListener('click', this.hideList.bind(this));
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
    this.visibility = false;
  }

  public hideList(event): void {
    if (!event.target.matches('.search-container, .search-container *')) {
      this.visibility = true;
    }
  }

  public keyboardAutocomplete(event): void {
    if (event.keyCode === 13 && event.target.value !== '') { // спец. символ enter

      this.predictionList === null || this.predictionList.length === 0 ?
        this.currentCity = event.target.value :
        this.currentCity = this.predictionList[this.selected].structured_formatting.main_text;
      this.houseServise.saveDataInStorage(this.currentCity, 'city');
      this.houseServise.saveDataInStorage(1, 'page');
      this.houseServise.sendCity(this.currentCity);
      this.selected = 0;
      this.predictionList = [];
      return;
    }

    if (event.keyCode === 40) { // спец. символ enter стрелка вниз
      if (this.selected < this.predictionList.length - 1) {
        this.selected++;
        this.currentCity = this.predictionList[this.selected];
      }
    }

    if (event.keyCode === 38) { // спец. символ стрелка вверх
      if (this.selected <= this.predictionList.length - 1 && this.selected > 0) {
        this.selected--;
      }
    }
    if (event.keyCode !== 38 && event.keyCode !== 40) { // спец. символ стрелка вверх и вниз
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
      }, (res) => {

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
    this.houseServise.saveDataInStorage(this.currentCity, 'city');
    this.houseServise.saveDataInStorage(1, 'page');
    this.houseServise.sendCity(this.currentCity);
    this.predictionList = [];
  }

  public setCountry(data): void {
    this.country = data;
    this.showSearch = true;
    if (this.searchElement !== undefined) {
      this.searchElement.nativeElement.value = null;
    }
    this.predictionList = [];
  }
}
