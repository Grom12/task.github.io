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
  public town: string;
  public country = 'uk';
  public place: any;
  public autocomplete: any;

  @ViewChild('search') public searchElement: ElementRef;

  constructor(private houseServise: HousesService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
  }

  ngOnInit() {
    this.houseServise.getShortCountry().subscribe(data => this.setCountry(data));
    this.counte();
  }


  counte() {
    this.mapsAPILoader.load().then(
      () => {
        this.autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {
          types: ['(cities)'],
          componentRestrictions: {country: `${this.country}`}
        });
        this.autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            this.place = this.autocomplete.getPlace();
            this.town = null;
            this.town = this.autocomplete.getPlace().name.toLowerCase().split(',')[0];
            this.houseServise.sendCity(this.town);


          });
        });
      }
    );
  }


  public setCountry(data) {
    this.country = data;
    console.log(this.country);
    this.autocomplete.componentRestrictions.country = this.country;
    const searchElement = document.querySelector('.hiddenSeach');
    if (searchElement !== null) {
      searchElement.classList.remove('hiddenSeach');
      searchElement.classList.add('controls');
    }

  }
}
