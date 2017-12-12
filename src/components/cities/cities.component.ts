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
  public cityVal;
  public selected = 0;
  public chooseCountryState = false;
  @ViewChild('search') public searchElement: ElementRef;

  constructor(private houseServise: HousesService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
  }

  ngOnInit() {
    const returnObj = JSON.parse(localStorage.getItem('country'));
    this.cityVal = (JSON.parse(returnObj));
    this.country = this.cityVal.language;

    this.houseServise.getShortCountry().subscribe(data => this.setCountry(data));
    this.mapsAPILoader.load().then(() => {
      this.autocomplete = new google.maps.places.AutocompleteService;
    });
  }


  keyboardAutocomplete(event) {
    if (event.keyCode === 13) {
      this.currentCity = this.predictionList[this.selected].structured_formatting.main_text;
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
    if(event.keyCode !== 38 && event.keyCode!== 40) {
      this.selected = 0;
    }




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


  onCityChange(city) {
    this.currentCity = city.structured_formatting.main_text;
    this.houseServise.sendCity(this.currentCity);
    this.predictionList = [];
  }


  setCountry(data) {

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

