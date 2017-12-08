import {Component, OnInit} from '@angular/core';
import {HousesService} from '../../services/house.service';


@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['../houses/houses.component.css'],

})
export class FavoritesComponent implements OnInit {
  public containHouses: any = [];
  public notFound = false;
  public counter = 0;

  constructor(private houseServise: HousesService) {
  }


  ngOnInit() {
    const returnObj = JSON.parse(localStorage.getItem('object'));
    for (const keys in returnObj) {
      this.containHouses.push(JSON.parse(returnObj[keys]));
    }

    if (this.containHouses.length === 0) {
      this.notFound = true;
    } else this.notFound = false;

    this.houseServise.setFavor(this.containHouses);
  }


  sendData(data: any) {
    this.houseServise.sendDetailInfo(true);
    this.houseServise.sendDetailInfo(data);
  }


  public clickFavorites(house: any, event): void {
    const returnObj = JSON.parse(localStorage.getItem('object'));
    for (const keys in returnObj) {
      if (keys === house.lister_url) {
        delete returnObj[keys];
        localStorage.setItem('object', JSON.stringify(returnObj));
      }
    }
    for (const keys in returnObj) {
      console.log(this.counter++);
    }

    if (this.counter === 0) {
      this.notFound = true;
    } else this.notFound = false;

    this.counter = 0
    event.target.classList.remove('star');
    event.target.classList.remove('star2');
    event.target.parentElement.remove();

  }
}
