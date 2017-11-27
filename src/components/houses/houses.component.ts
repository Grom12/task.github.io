import {Component, OnInit} from '@angular/core';
import {HousesService} from '../../services/house.service';
import {ActivatedRoute, Router} from '@angular/router';
import {allTowns, params} from '../../constants/links';
import {Subscription} from 'rxjs/Subscription';


@Component({
  selector: 'app-houses',
  templateUrl: './houses.component.html',
  styleUrls: ['./houses.component.css']
})
export class HousesComponent implements OnInit {

  public obj: any = {};
  public containHouses = [];
  public notFound = false;


  ngOnInit(): void {
    this.requestFunc();

  }
  constructor(private houseServise: HousesService) {}

  sendData(data: any) {
    this.houseServise.emitEvent(data);
  }



  public clickFavorites(house: any, event): void {
    event.target.classList.remove('star');
    if (!event.target.classList.contains('star2')) {
      event.target.classList.add('star2');
      const saveDtata = JSON.stringify(house);
      console.log(localStorage.setItem(house.title, saveDtata));
    } else if (event.target.classList.contains('star2')) {
      event.target.classList.remove('star2');
      event.target.classList.add('star');
      for (const key in localStorage) {
        if (key === house.title) {
          localStorage.removeItem(key);
        }
      }
    }
  }
  public requestFunc(): void {
    this.houseServise.getHouseFromCity().subscribe(
      response => {
        this.obj = response;
        console.log(this.containHouses = this.obj['response']['listings']);
        this.houseServise.setFavor(this.containHouses);
      }
    );
  }
}




