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
  public containHouses:Country;
  public selectedCountry: Country;
  public storageObject: any = {};

  constructor(private houseServise: HousesService) {
  }


  ngOnInit() {
    const returnObject = JSON.parse(localStorage.getItem('country'));
    this.containHouses = (JSON.parse(returnObject));

  }


  onSelect(country: Country): void {
    const saveDtata = JSON.stringify(country);
    this.storageObject = JSON.parse(localStorage.getItem('country'));
    this.storageObject = saveDtata;



    localStorage.setItem('country', JSON.stringify(this.storageObject));
    const returnObject = JSON.parse(localStorage.getItem('country'));

    this.containHouses = (JSON.parse(returnObject));
    ///

    this.selectedCountry =  this.containHouses;
    this.houseServise.emitEvent2(country.linked);
    this.houseServise.sendShortCountry(country.language);
  }

}
