import {Component, OnInit} from '@angular/core';
import {HousesService} from '../../services/house.service';
import {} from '@types/googlemaps';


class Country {
  id: number;
  name: string;
  linked: string;
  language: string;
}

const Countries: Country[] = [
  {id: 1, name: 'Brazil', linked: 'https://api.nestoria.com.br/ap', language: 'br'},
  {id: 2, name: 'Spain', linked: 'https://api.nestoria.es/api', language: 'es'},
  {id: 3, name: 'Germany', linked: 'https://api.nestoria.de/api', language: 'de'},
  {id: 4, name: 'France', linked: 'https://api.nestoria.fr/api', language: 'fr'},
  {id: 5, name: 'Italy', linked: 'https://api.nestoria.it/api', language: 'it'},
  {id: 5, name: 'United Kingdom', linked: 'https://api.nestoria.co.uk/api', language: 'uk'}
];


@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  countries = Countries;
  selectedCountry: Country;

  constructor(private houseServise: HousesService) {
  }

  ngOnInit() {
  }


  onSelect(country: Country): void {
    this.selectedCountry = country;
    this.houseServise.emitEvent2(country.linked);
    this.houseServise.sendShortCountry(country.language);
  }

}
