import {Component, HostListener, OnInit} from '@angular/core';
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
  public listVisibility: boolean = true;

  @ViewChild('search') private searchElement: ElementRef;

  constructor(private houseServise: HousesService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone) {

    this.subscriptionGetShortCounter = this.houseServise.getData('eventShortCountry').subscribe(
      data => this.setCountry(data));
  }

  public ngOnInit(): void {
    const returnObj = JSON.parse(localStorage.getItem('country'));
    if (returnObj) {
      this.country = returnObj.language;
    }

    this.mapsAPILoader.load().then(() => {
      this.autocomplete = new google.maps.places.AutocompleteService;
      const returnCity = JSON.parse(localStorage.getItem('city'));
      if (returnCity) {
        this.searchElement.nativeElement.value = returnCity;
        this.houseServise.sendData(returnCity, 'eventWithCity');
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onClick(event) {
    if (!event.target.matches('.search-container, .search-container *')) {
      this.listVisibility = true;
    }
  }

  public showList(): void {
    this.listVisibility = false;
  }

  public keyboardAutocomplete(event): void {
    if (event.keyCode === 13 && event.target.value !== '') { // special charCode "enter"
      this.currentCity = this.predictionList === null || this.predictionList.length === 0 ?
        event.target.value : this.predictionList[this.selected].structured_formatting.main_text;
      this.houseServise.saveDataInStorage(this.currentCity, 'city');
      this.houseServise.saveDataInStorage(1, 'page');
      this.houseServise.sendData(this.currentCity, 'eventWithCity');
      this.selected = 0;
      this.predictionList = [];
      return;
    }
    if (event.keyCode === 40) { //  special charCode "down arrow"
      if (this.selected < this.predictionList.length - 1) {
        this.selected++;
        this.currentCity = this.predictionList[this.selected];
      }
    }
    if (event.keyCode === 38) { // special charCode "up arrow"
      if (this.selected <= this.predictionList.length - 1 && this.selected > 0) {
        this.selected--;
      }
    }
    if (event.keyCode !== 38 && event.keyCode !== 40) { //  special charCodes "up arrow" and "down arrow"
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
    this.houseServise.sendData(this.currentCity, 'eventWithCity');
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
