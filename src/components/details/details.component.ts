import {Component, OnInit} from '@angular/core';
import {HousesService} from '../../services/house.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['../houses/houses.component.css']
})
export class DetailsComponent implements OnInit {
  public detailHouse: any;
  public condition: boolean = false;

  constructor(private houseService: HousesService) {
  }

  public ngOnInit(): void {
    this.houseService.getEventModal().subscribe(
      data => this.getDataStateWindow(data));
    this.houseService.getEventModal().subscribe(
      data => this.getDataHouse(data));
  }

  public getDataHouse(data): void {
    this.detailHouse = data;
  }

  public getDataStateWindow(data): void {
    this.condition = data;
  }

  public closeWindow(data: any): void {
    this.condition = data;
  }
}
