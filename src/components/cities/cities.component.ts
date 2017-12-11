import {Component, OnInit, SimpleChanges} from '@angular/core';
import {HousesService} from '../../services/house.service';
import {AgmCoreModule, MapsAPILoader} from '@agm/core';
import {} from '@types/googlemaps';
import {ViewChild, ElementRef, NgZone} from '@angular/core';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {
  public currentCity = '';
  public country = 'uk';
  public autocomplete: any;
  public predictionList: any;
  public chooseCountryState = false;
  @ViewChild('search') public searchElement: ElementRef;

  constructor(private houseServise: HousesService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
  }

  ngOnInit() {
    this.houseServise.getShortCountry().subscribe(data => this.setCountry(data));
    this.mapsAPILoader.load().then(() => {
      this.autocomplete = new google.maps.places.AutocompleteService;
    });
  }


  keyboardAutocomplete(event) {
    this.currentCity = event.target.value || '';
    if (event.target.value) {


      this.autocomplete.getPlacePredictions({
        input: event.target.value,
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


  public onCityChange(city) {
    this.currentCity = city.structured_formatting.main_text;
    this.houseServise.sendCity(this.currentCity);
    this.predictionList = [];
  }


  public setCountry(data) {
    this.country = data;
    this.chooseCountryState = true;
    const searchElement = document.querySelector('.hiddenSeach');
    if (searchElement !== null) {
      searchElement.classList.remove('hiddenSeach');
      searchElement.classList.add('cities');
    }

    this.searchElement.nativeElement.value = null;
    this.predictionList = [];
  }
}
