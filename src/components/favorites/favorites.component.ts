import {Component, OnInit} from '@angular/core';
import {HousesService} from '../../services/house.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['../houses/houses.component.css'],

})
export class FavoritesComponent implements OnInit {
  public containHouses: any = [];


  constructor(private houseServise: HousesService) {
  }


  ngOnInit() {

    const returnObj = JSON.parse(localStorage.getItem('object'));
    for (const keys in returnObj) {
      this.containHouses.push(JSON.parse(returnObj[keys]));
    }
    console.log(this.containHouses);
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
    event.target.classList.remove('star');
    event.target.classList.remove('star2');
    event.target.parentElement.remove();
  }
}
