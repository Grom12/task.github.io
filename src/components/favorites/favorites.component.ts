import {Component, OnInit} from '@angular/core';
import {HousesService} from '../../services/house.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['../houses/houses.component.css'],

})
export class FavoritesComponent implements OnInit {
  private containHouses: any = [];
  private notFound: boolean = false;
  private counter: number = 0;

  constructor(private houseService: HousesService) {
  }

  public ngOnInit(): void {
    const returnObj = JSON.parse(localStorage.getItem('object'));
    for (const keys in returnObj) {
      this.containHouses.push(JSON.parse(returnObj[keys]));
    }

    this.notFound = this.containHouses.length === 0;

    this.houseService.setFavor(this.containHouses);
  }

  public sendData(data: any): void {
    this.houseService.sendData(true,'eventWithModal');
    this.houseService.sendData(data,'eventWithModal');
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
      this.counter++;
    }
    this.notFound = this.counter === 0;
    this.counter = 0;
    event.target.parentElement.remove();
  }
}
