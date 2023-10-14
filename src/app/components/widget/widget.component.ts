import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription, skip } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.less'],
})
export class WidgetComponent implements OnInit {
  private subUserAddress!: Subscription;

  constructor(
    private readonly apiService: ApiService,
    private readonly mapService: MapService
  ) {}
  ngOnInit(): void {
    this.getUserAddress();
  }
  addressForm = new FormGroup({
    addressValue: new FormControl(''),
  });

  private getUserAddress() {
    this.subUserAddress = this.mapService.userCoordinates
      .pipe(skip(1))
      .subscribe(async (point) => {
        let address = await this.apiService.getAddressFromPoint(point);
        console.log(address);
        this.addressForm.controls.addressValue.setValue(
          `${address.town ? address.town : address.state}, ${address.road}, ${
            address.house_number
          }`
        );
      });
  }

  cons(e?: any) {
    console.log(22, e);
  }
}
