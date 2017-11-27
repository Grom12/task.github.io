import {Component, OnInit} from '@angular/core';
import {HousesService} from '../../services/house.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['../houses/houses.component.css']
})
export class DetailsComponent implements OnInit {
  public detailHouse = [];
  subscription: Subscription;

  constructor(private houseServise: HousesService) {
  }

  ngOnInit() {
    this.houseServise.getEvent().subscribe(data => this.getData(data));
  }


  public getData(data) {

    this.detailHouse = data;
  }

  public clickClose(house: any, event): void {
    event.target.parentElement.classList.add('close');
  }

}
