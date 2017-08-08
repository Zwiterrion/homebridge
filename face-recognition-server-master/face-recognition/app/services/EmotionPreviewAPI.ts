import { Injectable } from '@angular/core';
import CanvasUtils from './utils/CanvasUtils';
import { Http,Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

const API_ROOT_URL = 'https://api.projectoxford.ai/emotion/v1.0/';
const API_KEY = '7f7d031117c44bec9b1a176627d36b8f';

@Injectable()
export class EmotionPreviewAPI {

  constructor(private http: Http) {}

  previewEmotions(dataURI:any) {
    let headers = new Headers({'Content-Type': 'application/octet-stream','Ocp-Apim-Subscription-Key': API_KEY});
    let options = new RequestOptions({ headers: headers });
    let url = API_ROOT_URL+'/recognize';
    let data = CanvasUtils.convertToDataURIToBinary(dataURI);
    return this.http.post(url,data,options)
      .map(res=> {
        return res.json().map((face:any) => {
          const bestScore = Object.keys(face.scores).reduce(
            (leftValue:any, rigthValue:any) => {
              if(face.scores[leftValue] > face.scores[rigthValue]) {
                return leftValue;
              }
              return rigthValue;
            }
          );
          return {
            faceRectangle: face.faceRectangle,
            emotion: bestScore
          }
        });
      });
  }
}
