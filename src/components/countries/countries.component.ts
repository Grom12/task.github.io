import {Component, OnInit} from '@angular/core';
import {HousesService} from '../../services/house.service';
import {} from '@types/googlemaps';
import {Countries} from '../../constants/Countries';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  public countries: any = Countries;
  public selectedCountry: any;

  constructor(private houseServise: HousesService) {
  }

  public ngOnInit(): void {
    const returnObject = JSON.parse(localStorage.getItem('country'));
    if (returnObject !== null) {
      this.selectedCountry = returnObject;
      this.houseServise.standardURL = returnObject.linked;
      this.houseServise.sendShortCountry(returnObject.language);
    }
  }

  public onSelect(country): void {
    const saveDtata = JSON.stringify(country);
    localStorage.setItem('country', saveDtata);
    const clearCity = JSON.stringify(null);
    localStorage.setItem('city', clearCity);
    const clearHouse = JSON.stringify({});
    localStorage.setItem('houses', clearHouse);
    this.houseServise.saveDataInStorage(1, 'page');
    this.houseServise.saveDataInStorage({}, 'formData');
    this.houseServise.saveDataInStorage({}, 'radioButton');
    this.houseServise.saveDataInStorage({}, 'checkbox');
    this.selectedCountry = country;
    this.houseServise.sendEventCountry(country.linked);
    this.houseServise.sendShortCountry(country.language);
  }
}
