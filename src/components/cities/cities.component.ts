import {Component, OnInit, SimpleChanges} from '@angular/core';
import {HousesService} from '../../services/house.service';
import {AgmCoreModule, MapsAPILoader} from '@agm/core';
import {} from '@types/googlemaps';
import {ViewChild, ElementRef, NgZone} from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {
  public currentCity = '';
  public country = 'uk';
  public autocomplete: any;
  predictionList: any;
  public selected = 0;
  public subscriptionGetShortCountr: any;
  @ViewChild('search') public searchElement: ElementRef;

  constructor(private houseServise: HousesService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
    this.subscriptionGetShortCountr = this.houseServise.getShortCountry().subscribe(data => this.setCountry(data));
  }


  ngOnInit() {
    const returnObj = JSON.parse(localStorage.getItem('country'));
    if (returnObj !== null) {
      this.country = returnObj.language;
    }


    $(".city-search").focus(function () {
      $('.prediction-list-wrapper').show();
    });
    $(document).on('click', function (e) {
      if (!$(e.target).closest(".search-container").length) {
        $('.prediction-list-wrapper').hide();
      }
      e.stopPropagation();
    });

    this.mapsAPILoader.load().then(() => {
      this.autocomplete = new google.maps.places.AutocompleteService;
      const returnCity = JSON.parse(localStorage.getItem('city'));
      if (returnCity !== null) {
        this.searchElement.nativeElement.value = returnCity;
        this.houseServise.sendCity(returnCity);
      }
    });

  }


  keyboardAutocomplete(event) {
    if (event.keyCode === 13 && event.target.value !== '') {
      console.log(this.predictionList);


      if (this.predictionList === null || this.predictionList.length === 0) {
        this.currentCity = event.target.value;
      } else this.currentCity = this.predictionList[this.selected].structured_formatting.main_text;

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


  onCityChange(city) {
    this.currentCity = city.structured_formatting.main_text;
    const saveDtata = JSON.stringify(this.currentCity);
    localStorage.setItem('city', saveDtata);

    const returnCity = JSON.parse(localStorage.getItem('city'));
    if (returnCity !== null) {
      this.searchElement.nativeElement.value = returnCity;
    }
    this.houseServise.savePage(1);
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
