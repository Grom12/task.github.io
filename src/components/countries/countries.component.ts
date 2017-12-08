import {Component, OnInit} from '@angular/core';
import {HousesService} from '../../services/house.service';
import {} from '@types/googlemaps';
import {Countries} from '../../constants/Countries';
import {Country} from '../../constants/Country';


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
