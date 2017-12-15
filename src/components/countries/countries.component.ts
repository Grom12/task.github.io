import {Component, NgZone, OnChanges, OnInit} from '@angular/core';
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
  public storageObject: any;
  public selectedCountry: any;


  constructor(private houseServise: HousesService) {
  }


  ngOnInit() {
    const returnObject = JSON.parse(localStorage.getItem('country'));
    if (returnObject !== null) {
      this.selectedCountry = returnObject;
      this.houseServise.standardURL = returnObject.linked;
      this.houseServise.sendShortCountry(returnObject.language);
    }
  }


  onSelect(country): void {
    const saveDtata = JSON.stringify(country);
    localStorage.setItem('country', saveDtata);
    const clearCity = JSON.stringify(null);
    localStorage.setItem('city', clearCity);

    const clearHouse = JSON.stringify({});
    localStorage.setItem('houses', clearHouse);
    this.houseServise.savePage(1);

    this.houseServise.saveDataForm({});
    this.houseServise.selectButton({});
    this.houseServise.selectCheckBox({});
    this.selectedCountry = country;
    this.houseServise.emitEvent2(country.linked);
    this.houseServise.sendShortCountry(country.language);
  }

}
