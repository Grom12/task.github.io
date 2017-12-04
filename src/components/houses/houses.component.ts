import {Component, OnInit} from '@angular/core';
import {HousesService} from '../../services/house.service';
import {NgForm} from '@angular/forms';
import {NgProgress} from 'ngx-progressbar';

@Component({
  selector: 'app-houses',
  templateUrl: './houses.component.html',
  styleUrls: ['./houses.component.css']
})
export class HousesComponent implements OnInit {

  public checkResponse: any = {};
  public containHouses = [];
  public currPage = 1;
  public chackNextPage = true;
  public objectHouse: any = [];
  public stateImages = false;
  public notFound = false;
  public storageObject: any = {};

  ngOnInit(): void {
    this.requestFunc();
    this.houseServise.getEventCountry().subscribe(data => this.getDataHouse(data));
    this.houseServise.getCity().subscribe(data => this.getDataCity(data));
  }


  public getDataCity(data) {
    this.currPage = 1;
    this.objectHouse.city = data;
    this.requestFunc();

  }


  public getDataHouse(data) {
    this.objectHouse.country = data;
  }


  constructor(private houseServise: HousesService, public ngProgress: NgProgress) {
  }

  public prevPage() {
    if (this.currPage > 1) {
      this.currPage--;
      this.requestFunc();
    }
  }


  public nextPage() {
    this.currPage++;
    this.requestFunc();
  }

  public sendForm(myForm: NgForm): void {
    this.currPage = 1;
    this.objectHouse.maxPrice = myForm.value.maxPrice;
    this.objectHouse.minPrice = myForm.value.minPrice;
    this.objectHouse.bedroomMax = myForm.value.bedroomMax;
    this.objectHouse.bedrooMin = myForm.value.bedroomMin;
    this.objectHouse.bathroomMax = myForm.value.bathroomMax;
    this.objectHouse.bathroomMin = myForm.value.bathroomMin;
    if (this.stateImages === true) {
      this.objectHouse.hasPhoto = 1;
    } else this.objectHouse.hasPhoto = 0;
    console.log(this.objectHouse.bedrooMin);
    this.requestFunc();
  }

  public onSelectRent() {
    this.objectHouse.typelist = 'rent';
  }

  public onSelectBuy() {
    this.objectHouse.typelist = 'buy';
  }


  public onSelectImages() {
    this.stateImages = !this.stateImages;
  }


  public sendData(data: any) {
    this.houseServise.sendDetailInfo(true);
    this.houseServise.sendDetailInfo(data);
  }

  public clickFavorites(house: any, event): void {
    event.target.classList.remove('star');
    if (!event.target.classList.contains('star2')) {
      event.target.classList.add('star2');
      const saveDtata = JSON.stringify(house);
      this.storageObject = JSON.parse(localStorage.getItem('object'));
      this.storageObject[house.lister_url] = saveDtata;
      localStorage.setItem('object', JSON.stringify(this.storageObject));
    } else if (event.target.classList.contains('star2')) {
      event.target.classList.remove('star2');
      event.target.classList.add('star');
      const returnObj = JSON.parse(localStorage.getItem('object'));
      for (const keys in returnObj) {
        if (keys === house.lister_url) {
          delete returnObj[keys];
          delete this.storageObject[keys];
          localStorage.setItem('object', JSON.stringify(returnObj));
        }
      }
    }
  }


  public requestFunc(): void {
    this.ngProgress.start();
    this.houseServise.getHouse(this.currPage, this.objectHouse).subscribe(
      response => {
        this.checkResponse = response;
        if (this.checkResponse.response.listings.length === 0) {
          this.ngProgress.done();
          this.chackNextPage = false;
          this.notFound = true;
          this.containHouses = [];
        } else {
          console.log(this.containHouses = this.checkResponse['response']['listings']);
          this.notFound = false;
          this.houseServise.setFavor(this.containHouses);
          this.ngProgress.done();
        }
      }
    );
  }
}
