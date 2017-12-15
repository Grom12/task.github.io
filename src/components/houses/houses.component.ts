import {Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HousesService} from '../../services/house.service';
import {NgForm} from '@angular/forms';
import {NgProgress} from 'ngx-progressbar';
import {forEach} from '@angular/router/src/utils/collection';
import {isUndefined} from "util";


@Component({
  selector: 'app-houses',
  templateUrl: './houses.component.html',
  styleUrls: ['./houses.component.css']
})
export class HousesComponent implements OnInit, OnDestroy {
  ngZone: any;

  public checkResponse: any = {};
  public containHouses = [];
  public currPage = 1;
  public chackNextPage = false;
  public chackPrevPage = false;
  public chackPage = false;
  public countPages: number;
  public objectHouse: any = [];
  public toggleImg = false;
  public notFound = false;
  public storageObject: any = {};
  public subscriptionGetCountry: any;
  public subscriptionGetCity: any;
  public maxPrices;
  public bathroomsMin;
  public bathroomsMax;
  public bedroomsMin;
  public bedroomsMax;
  public minPrices;
  public statusImg = false;
  public numRadio;
  public isChecked;
  public isChecked2;


  ngOnInit(): void {

    const returnHouse = JSON.parse(localStorage.getItem('houses'));
    if (returnHouse !== null) {
      this.containHouses = returnHouse;
    }

    const returnButton = JSON.parse(localStorage.getItem('radioButton'));
    if (returnButton !== null && returnButton === 1) {
      document.getElementById('choiceRent').setAttribute('checked', '');
      this.isChecked2 = true;

      this.objectHouse.typelist = 'rent';
    } else if (returnButton !== null && returnButton === 2) {
      document.getElementById('choiceBuy').setAttribute('checked', '');
      this.isChecked = true;
      this.objectHouse.typelist = 'buy';
    }

    const returnCheckbox = JSON.parse(localStorage.getItem('checkbox'));
    if (returnCheckbox !== null && returnCheckbox == 1) {
      this.objectHouse.hasPhoto = 1;
      this.toggleImg = true;
      this.statusImg = true;
    } else {
      this.toggleImg = false;

      this.objectHouse.hasPhoto = 0;
      this.statusImg = false;
    }


    const returnFormDate = JSON.parse(localStorage.getItem('formData'));
    if (returnFormDate !== null) {
      this.objectHouse.maxPrice = this.maxPrices = returnFormDate.maxPrice;
      this.objectHouse.minPrice = this.minPrices = returnFormDate.minPrice;
      this.objectHouse.bedroomMax = this.bedroomsMax = returnFormDate.bedroomMax;
      this.objectHouse.bedrooMin = this.bedroomsMin = returnFormDate.bedroomMin;
      this.objectHouse.bathroomMax = this.bathroomsMax = returnFormDate.bathroomMax;
      this.objectHouse.bathroomMin = this.bathroomsMin = returnFormDate.bathroomMin;
    }


    if (this.containHouses.length === 0 || this.containHouses.length === undefined) {
      this.notFound = true;
    } else this.notFound = false;
    console.log(this.containHouses.length);

    this.houseServise.setFavor(this.containHouses);
    this.subscriptionGetCountry = this.houseServise.getEventCountry().subscribe(data => this.getDataHouse(data));
    this.subscriptionGetCity = this.houseServise.getCity().subscribe(data => this.getDataCity(data));
  }

  ngOnDestroy(): void {
    this.subscriptionGetCountry.unsubscribe();
    this.subscriptionGetCity.unsubscribe();
  }


  public getDataCity(data) {
    this.currPage = 1;
    const returnPage = JSON.parse(localStorage.getItem('page'));
    if (returnPage !== null) {
      this.currPage = returnPage;
    }
    this.objectHouse.city = data;
    this.requestFunc();
  }


  public getDataHouse(data) {
    this.containHouses = [];
    this.statusImg = false;
    this.isChecked = false;
    this.isChecked = false;
    this.isChecked2 = false;
    this.objectHouse.maxPrice = this.maxPrices = '';
    this.objectHouse.minPrice = this.minPrices = '';
    this.objectHouse.bedroomMax = this.bedroomsMax = '';
    this.objectHouse.bedrooMin = this.bedroomsMin = '';
    this.objectHouse.bathroomMax = this.bathroomsMax = '';
    this.objectHouse.bathroomMin = this.bathroomsMin = '';
    this.objectHouse.country = data;
    this.notFound = true;
    this.chackNextPage = false;
    this.chackPrevPage = false;
    this.chackPage = false;
  }


  constructor(private houseServise: HousesService, public ngProgress: NgProgress, private zone: NgZone) {

  }

  public prevPage() {
    if (this.currPage > 1) {
      this.currPage--;
      this.houseServise.savePage(this.currPage);
      this.requestFunc();
    }
  }

  public nextPage() {
    if (this.currPage <= this.countPages) {
      this.currPage++;
      this.houseServise.savePage(this.currPage);
      this.requestFunc();
    }
  }


  public sendForm(myForm: NgForm): void {
    this.currPage = 1;
    this.houseServise.saveDataForm(myForm.value);
    this.objectHouse.maxPrice = myForm.value.maxPrice;
    this.objectHouse.minPrice = myForm.value.minPrice;
    this.objectHouse.bedroomMax = myForm.value.bedroomMax;
    this.objectHouse.bedrooMin = myForm.value.bedroomMin;
    this.objectHouse.bathroomMax = myForm.value.bathroomMax;
    this.objectHouse.bathroomMin = myForm.value.bathroomMin;


    if (this.toggleImg === true) {
      this.objectHouse.hasPhoto = 1;
      this.houseServise.selectCheckBox(1);
    } else {
      this.objectHouse.hasPhoto = 0;
      this.houseServise.selectCheckBox(0);
    }

    if (this.numRadio === 1) {
      this.houseServise.selectButton(1);
      this.objectHouse.typelist = 'rent';

    } else if (this.numRadio === 2) {
      this.houseServise.selectButton(2);
      this.objectHouse.typelist = 'buy';
    }
    console.log(this.objectHouse.bedrooMin);
    this.requestFunc();
  }

  public onSelectRent() {
    this.numRadio = 1;
  }

  public onSelectBuy() {
    this.numRadio = 2;
  }


  public onSelectImages() {
    this.toggleImg = !this.toggleImg;

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
      console.log(JSON.parse(localStorage.getItem('object')));
      if (JSON.parse(localStorage.getItem('object')) !== null) {
        this.storageObject = JSON.parse(localStorage.getItem('object'));
      }
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


        this.countPages = response.response.total_pages;
        if (response.response.total_pages === undefined || response.response.total_pages === 0) {
          this.chackNextPage = false;
          this.chackPrevPage = false;

        }
        if (this.currPage === 1) {
          this.chackNextPage = true;
          this.chackPrevPage = false;
        } else this.chackPrevPage = true;

        if (this.currPage <= this.countPages) {
          this.chackNextPage = true;
        } else this.chackNextPage = false;

        if (this.checkResponse.response.listings.length === 0) {
          this.ngProgress.done();
          this.notFound = true;
          this.chackPage = false;
          this.containHouses = [];
        } else {
          console.log(this.containHouses = this.checkResponse['response']['listings']);

          const saveDtata = JSON.stringify(this.containHouses);
          localStorage.setItem('houses', saveDtata);

          this.notFound = false;
          this.chackPage = true;
          this.houseServise.setFavor(this.containHouses);
          this.ngProgress.done();
        }
      }
    );
  }
}
