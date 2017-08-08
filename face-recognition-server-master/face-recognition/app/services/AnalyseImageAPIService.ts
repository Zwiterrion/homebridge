import { Injectable } from '@angular/core';
import CanvasUtils from './utils/CanvasUtils';
import { Http,Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

//const API_KEY = '593a04114f2e436c8eb7ee11d9ba50f6';
const API_KEY = '27de0200fb76493f97384e815d801676';
const API_ROOT_URL = 'https://westeurope.api.cognitive.microsoft.com/vision/v1.0/';
const GROUP_ID = 'linka-digitech';

@Injectable()
export class AnalyseImageAPIService {

  constructor(private http: Http) {}

  analyse(dataURI:any) {
    let headers = new Headers({'Content-Type': 'application/octet-stream','Ocp-Apim-Subscription-Key': API_KEY});
    let options = new RequestOptions({ headers: headers });
    let url = API_ROOT_URL+'/analyze?visualFeatures=Faces';
    let data = CanvasUtils.convertToDataURIToBinary(dataURI);

    return this.http.post(url, data, options)
    .map(res => res.json().faces);
  }
}
