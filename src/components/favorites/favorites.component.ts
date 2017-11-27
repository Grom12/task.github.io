import {Component, OnInit} from '@angular/core';
import {HousesComponent} from '../houses/houses.component';
import {HousesService} from '../../services/house.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['../houses/houses.component.css']
})
export class FavoritesComponent implements OnInit {
  public containHouses: any = [];

  constructor(private houseServise: HousesService) {
  }

  ngOnInit() {
    for (let i in localStorage) {
      this.containHouses.push(JSON.parse(localStorage.getItem(i)));
      this.houseServise.setFavor(this.containHouses);
    }
  }



  sendData(data: any) {
    this.houseServise.emitEvent(data);
  }

  public clickFavorites(house: any, event): void {
    for (const key in localStorage) {
      if (key === house.title) {
        localStorage.removeItem(key);
      }
    }
    event.target.classList.remove('star');
    event.target.classList.remove('star2');
    event.target.parentElement.remove();

  }

}








