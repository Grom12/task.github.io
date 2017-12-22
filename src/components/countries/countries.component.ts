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
    if (returnObject) {
      this.selectedCountry = returnObject;
      this.houseServise.standardURL = returnObject.linked;
      this.houseServise.sendData(returnObject.language, 'eventShortCountry');
    }
  }

  public onSelect(country: any): void {
    this.houseServise.saveDataInStorage(country, 'country');
    this.houseServise.saveDataInStorage(null, 'city');
    this.houseServise.saveDataInStorage({}, 'houses')
    this.houseServise.saveDataInStorage(1, 'page');
    this.houseServise.saveDataInStorage({}, 'formData');
    this.houseServise.saveDataInStorage({}, 'radioButton');
    this.houseServise.saveDataInStorage({}, 'checkbox');
    this.selectedCountry = country;
    this.houseServise.sendData(country.linked, 'eventWithCountry');
    this.houseServise.sendData(country.language, 'eventShortCountry');
  }
}
