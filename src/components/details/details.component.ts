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
    this.houseService.getData('eventWithModal').subscribe(
      data => this.closeWindow(data));
    this.houseService.getData('eventWithModal').subscribe(
      data => this.getDataHouse(data));
  }

  public getDataHouse(data): void {
    this.detailHouse = data;
  }

  public closeWindow(data: any): void {
    this.condition = data;
  }
}
