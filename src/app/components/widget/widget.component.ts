import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TuiAlertService } from '@taiga-ui/core';
import { Subscription, debounceTime, filter, map, skip, tap } from 'rxjs';
import { Department } from 'src/app/interfaces/department';
import { Point } from 'src/app/interfaces/point';
import { ApiService } from 'src/app/services/api.service';
import { MapService } from 'src/app/services/map.service';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { TuiAlertContext } from '@taiga-ui/cdk';
import { TuiAlertOptions } from '@taiga-ui/core';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.less'],
})
export class WidgetComponent implements OnInit, OnDestroy {
  private subUserAddress!: Subscription;
  @ViewChild('withdrawTemplate')
  withdrawTemplate?: TemplateRef<TuiAlertContext<TuiAlertOptions<unknown>>>;

  constructor(
    public readonly apiService: ApiService,
    public readonly mapService: MapService,
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService
  ) {}

  ngOnInit(): void {
    this.getUserAddress();
    this.addressForm.controls.addressValue.valueChanges
      .pipe(
        map((x) => String(x).trim()),
        filter((x) => x.length > 1),
        debounceTime(500)
      )
      .subscribe((x) => {
        this.changeAddress(x);
      });
  }

  optimal!: Department;
  text: string | null = '22';
  addressForm = new FormGroup({
    addressValue: new FormControl(''),
  });

  addressArrString: string[] = [];
  addressArr: { displayName: string; point: Point }[] = [];
  ngOnDestroy(): void {
    this.subUserAddress.unsubscribe();
  }

  private getUserAddress() {
    this.subUserAddress = this.mapService.userCoordinates
      .pipe(skip(1))
      .subscribe(async (point) => {
        let address = await this.apiService.getAddressFromPoint(point);
        this.addressForm.controls.addressValue.setValue(
          `${address.town ? address.town : address.state}, ${address.road}, ${
            address.house_number
          }`
        );
      });
  }

  public async changeAddress(address: string) {
    const addreses = await this.apiService.getPointFromAddress(address);
    let res = this.addressArr.filter(
      (i) =>
        i.displayName === String(this.addressForm.controls.addressValue.value)
    );
    if (res.length > 0) {
      console.log('res', this.addressForm.controls.addressValue.value, res);
      this.mapService.setUserGeolocation(res[0].point);
      this.optimal = await this.apiService.getOptimai(res[0].point);
      this.showOptimal();
    }
    this.addressArrString = addreses.map((i) => i.displayName);
    this.addressArr = addreses;
  }

  move() {
    this.apiService.departmentOptimal.next([this.optimal]);
  }

  showOptimal() {
    this.alerts
      .open(this.withdrawTemplate, {
        status: 'success',
        label: 'Нашли для вас оптимальный офис банка',
        autoClose: false,
      })
      .subscribe();
  }
}
