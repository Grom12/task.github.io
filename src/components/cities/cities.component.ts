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
    this.mapsAPILoader.load().then(
      () => {
        this.autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {
          types: ['(cities)'],
          componentRestrictions: {country: `${this.country}`}
        });
        this.autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            this.place = this.autocomplete.getPlace();
            this.town = this.place.name.toLowerCase().split(',')[0];
          });
        });

      }
    );
  }


  public setCountry(data) {
    this.country = data;
    console.log(this.country);
    this.autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {
      types: ['(cities)'],
      componentRestrictions: {country: `${this.country}`}
    });
  }

  returnCity(event) {
    if (event.keyCode === 13) {
      this.houseServise.sendCity(this.town);
    }
  }
}
