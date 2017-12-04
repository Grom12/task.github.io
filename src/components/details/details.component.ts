import {Component, OnInit} from '@angular/core';
import {HousesService} from '../../services/house.service';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['../houses/houses.component.css']
})
export class DetailsComponent implements OnInit {
  public detailHouse;
  condition = false;


  constructor(private houseServise: HousesService) {
  }

  ngOnInit() {
    this.houseServise.getEventModal().subscribe(data => this.getDataStateWindow(data));
    this.houseServise.getEventModal().subscribe(data => this.getDataHouse(data));

  }

  public getDataHouse(data) {
    this.detailHouse = data;
    console.log(this.detailHouse);
  }

  public getDataStateWindow(data) {
    this.condition = data;
  }


  closeWindow(data: any) {
    this.condition = data;
  }
}
