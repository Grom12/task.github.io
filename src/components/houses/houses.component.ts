import {Component, OnDestroy, OnInit} from '@angular/core';
import {HousesService} from '../../services/house.service';
import {FormGroup, FormControl, Validators, NgForm} from '@angular/forms';
import {NgProgress} from 'ngx-progressbar';

@Component({
  selector: 'app-houses',
  templateUrl: './houses.component.html',
  styleUrls: ['./houses.component.css']
})

export class HousesComponent implements OnInit, OnDestroy {
  private checkResponse: any = {};
  public containHouses: any = [];
  public currPage: number = 1;
  public isNextPage: boolean = false;
  public isPrevPage: boolean = false;
  public isNumPage: boolean = false;
  private countPages: number;
  private objectHouse: any = [];
  private toggleImg: boolean = false;
  public notFound: boolean = false;
  private storageObject: any = {};
  private subscriptionGetCountry: any;
  private subscriptionGetCity: any;
  public statusImg: boolean = false;
  private numRadio: number;
  public isCheckedBuy: boolean;
  public isCheckedRent: boolean;
  public myForm: FormGroup;

  public ngOnInit(): void {
    const returnHouse = JSON.parse(localStorage.getItem('houses'));
    if (returnHouse) {
      this.containHouses = returnHouse;
    }
    const returnButton = JSON.parse(localStorage.getItem('radioButton'));
    if (returnButton !== null && returnButton === 1) {
      document.getElementById('choiceRent').setAttribute('checked', '');
      this.isCheckedRent = true;
      this.objectHouse.typelist = 'rent';
    } else if (returnButton !== null && returnButton === 2) {
      document.getElementById('choiceBuy').setAttribute('checked', '');
      this.isCheckedBuy = true;
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
    const returnCity = JSON.parse(localStorage.getItem('city'));
    this.notFound = this.containHouses.length === 0 && returnCity != null || this.containHouses.length === undefined
      && returnCity != null;
    this.houseService.setFavor(this.containHouses);
    this.subscriptionGetCountry = this.houseService.getData('eventWithCountry').subscribe(
      data => this.getDataHouse(data));
    this.subscriptionGetCity = this.houseService.getData('eventWithCity').subscribe(
      data => this.getDataCity(data));
  }

  public ngOnDestroy(): void {
    this.subscriptionGetCountry.unsubscribe();
    this.subscriptionGetCity.unsubscribe();
  }

  public getDataCity(data: any): void {
    this.currPage = 1;
    const returnPage = JSON.parse(localStorage.getItem('page'));
    if (returnPage !== null) {
      this.currPage = returnPage;
    }
    this.objectHouse.city = data;
    this.requestFunc();
  }

  public getDataHouse(data: any): void {
    this.containHouses = [];
    this.statusImg = false;
    this.isCheckedBuy = false;
    this.isCheckedRent = false;
    this.objectHouse.maxPrice = '';
    this.objectHouse.minPrice = '';
    this.objectHouse.bedroomMax = '';
    this.objectHouse.bedroomMin = '';
    this.objectHouse.bathroomMax = '';
    this.objectHouse.bathroomMin = '';
    this.objectHouse.country = data;
    this.notFound = false;
    this.isNextPage = false;
    this.isPrevPage = false;
    this.isNumPage = false;
    this.myForm.reset();
  }

  constructor(private houseService: HousesService,
              private ngProgress: NgProgress) {
    const returnFormDate = JSON.parse(localStorage.getItem('formData'));
    if (returnFormDate) {
      this.objectHouse.maxPrice = returnFormDate.maxPrice;
      this.objectHouse.minPrice = returnFormDate.minPrice;
      this.objectHouse.bedroomMax = returnFormDate.bedroomMax;
      this.objectHouse.bedroomMin = returnFormDate.bedroomMin;
      this.objectHouse.bathroomMax = returnFormDate.bathroomMax;
      this.objectHouse.bathroomMin = returnFormDate.bathroomMin;
    }

    this.myForm = new FormGroup({
      'maxPrice': new FormControl(this.objectHouse.maxPrice, [
        Validators.pattern("[0-9]{0,999999999}")
      ]),
      'minPrice': new FormControl(this.objectHouse.minPrice, [
        Validators.pattern("[0-9]{0,999999999}")
      ]),
      'bedroomMax': new FormControl(this.objectHouse.bedroomMax, [
        Validators.pattern("[0-9]{0,999999999}")
      ]),
      'bedroomMin': new FormControl(this.objectHouse.bedroomMin, [
        Validators.pattern("[0-9]{0,999999999}")
      ]),
      'bathroomMax': new FormControl(this.objectHouse.bathroomMax, [
        Validators.pattern("[0-9]{0,999999999}")
      ]),
      'bathroomMin': new FormControl(this.objectHouse.bathroomMin, [
        Validators.pattern("[0-9]{0,999999999}")
      ]),
      'statusImg': new FormControl(this.statusImg)
    });
  }

  public prevPage(): void {
    if (this.currPage > 1) {
      this.currPage--;
      this.houseService.saveDataInStorage(this.currPage, 'page');
      this.requestFunc();
    }
  }

  public nextPage(): void {
    if (this.currPage <= this.countPages) {
      this.currPage++;
      this.houseService.saveDataInStorage(this.currPage, 'page');
      this.requestFunc();
    }
  }

  public sendForm(myForm: FormGroup): void {
    this.currPage = 1;
    this.houseService.saveDataInStorage(myForm.value, 'formData');
    this.objectHouse.maxPrice = myForm.value.maxPrice;
    this.objectHouse.minPrice = myForm.value.minPrice;
    this.objectHouse.bedroomMax = myForm.value.bedroomMax;
    this.objectHouse.bedroomMin = myForm.value.bedroomMin;
    this.objectHouse.bathroomMax = myForm.value.bathroomMax;
    this.objectHouse.bathroomMin = myForm.value.bathroomMin;
    if (this.toggleImg === true) {
      this.objectHouse.hasPhoto = 1;
      this.houseService.saveDataInStorage(1, 'checkbox');
    } else {
      this.objectHouse.hasPhoto = 0;
      this.houseService.saveDataInStorage(0, 'checkbox');
    }
    if (this.numRadio === 1) {
      this.houseService.saveDataInStorage(1, 'radioButton');
      this.objectHouse.typelist = 'rent';

    } else if (this.numRadio === 2) {
      this.houseService.saveDataInStorage(2, 'radioButton');
      this.objectHouse.typelist = 'buy';
    }
    this.requestFunc();
  }

  public onSelectRent(): void {
    this.numRadio = 1;
  }

  public onSelectBuy(): void {
    this.numRadio = 2;
  }

  public onSelectImages(): void {
    this.toggleImg = !this.toggleImg;
  }

  public sendData(data: any): void {
    this.houseService.sendData(true, 'eventWithModal');
    this.houseService.sendData(data, 'eventWithModal');
  }

  public clickFavorites(house: any, event): void {
    event.target.classList.remove('star');
    if (!event.target.classList.contains('starEmpty')) {
      event.target.classList.add('starEmpty');
      const saveData = JSON.stringify(house);
      JSON.parse(localStorage.getItem('object'));
      if (JSON.parse(localStorage.getItem('object')) !== null) {
        this.storageObject = JSON.parse(localStorage.getItem('object'));
      }
      this.storageObject[house.lister_url] = saveData;
      localStorage.setItem('object', JSON.stringify(this.storageObject));
    } else if (event.target.classList.contains('starEmpty')) {
      event.target.classList.remove('starEmpty');
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
    this.houseService.getHouse(this.currPage, this.objectHouse).subscribe(
      response => {
        this.checkResponse = response;
        this.countPages = response.response.total_pages;
        if (response.response.total_pages === undefined || response.response.total_pages === 0) {
          this.isNextPage = false;
          this.isPrevPage = false;
        }
        if (this.currPage === 1) {
          this.isNextPage = true;
          this.isPrevPage = false;
        } else {
          this.isPrevPage = true;
        }
        this.isNextPage = this.currPage <= this.countPages;
        if (this.checkResponse.response.listings.length === 0) {
          this.ngProgress.done();
          this.notFound = true;
          this.isNumPage = false;
          this.containHouses = [];
        } else {
          this.containHouses = this.checkResponse['response']['listings'];
          this.houseService.saveDataInStorage(this.containHouses, 'houses');
          this.notFound = false;
          this.isNumPage = true;
          this.houseService.setFavor(this.containHouses);
          this.ngProgress.done();
        }
      }
    );
  }
}
