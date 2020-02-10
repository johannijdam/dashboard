import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import * as moment from 'moment';


@Component({
  selector: 'app-co2',
  templateUrl: './co2.component.html',
  styleUrls: ['./co2.component.scss']
})
export class Co2Component implements OnInit {

  public co2Data = {};
  public cssClass = 'badge badge-success';
  public stations = [
      {
        'mac': '70:ee:50:02:9f:c2',
        'name': 'Woonkamer'
      },
      {
        'mac': '70:ee:50:02:9f:c2',
        'name': 'Woonkamer'
      }
    ];

  constructor(
    private http: HttpClient,
  ) {
    const self = this;

    this.stations.forEach(function (item) {
      self.readStation(item.mac);
      setInterval(function() {
        self.readStation(item.mac);
      }, 300000);
    });
  }

  ngOnInit() {
  }

  readStation(macAdress: String) {
    this.getOouthToken().then(data => {
      const header = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      });

      // @ts-ignore
      const accessToken = data.access_token;
      const startdate = moment();
      const params = new HttpParams()
        .set('device_id', '70:ee:50:02:9f:c2')
        .set('module_id', macAdress.toString())
        .set('scale', '5min')
        .set('type', 'co2')
        .set('limit', '1')
        .set('real_time', 'true')
        .set('date_end', startdate.unix().toString())
        .set('date_begin', startdate.subtract(15, "minutes").unix().toString())
        .set('access_token', accessToken);

      return this.http.get(
        'https://api.netatmo.com/api/getmeasure',
        {
          'params': params
        },
      ).subscribe((data) => {
        // @ts-ignore
        console.log(data.body);
        // @ts-ignore
        this.co2Data = data.body[0].value;

        if(this.co2Data > 1500) {
          this.cssClass = "badge badge-danger";
        } else {
          this.cssClass = "badge badge-success";
        }
      });
    })
  }

  getOouthToken() {
    const header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let data = "";
    data += 'grant_type=password';
    data += '&client_id=';
    data += '&client_secret=';
    data += '&username=';
    data += '&password=';
    data += '&scope=read_station'

    return this.http.post(
      'https://api.netatmo.com/oauth2/token',
      data,
      {
        'headers': header
      }
    ).toPromise();
  }

}
