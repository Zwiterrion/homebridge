import { Injectable } from '@angular/core';
import CanvasUtils from './utils/CanvasUtils';
import { Http,Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

const API_KEY = 'eb8bc9e352f6421f9dc3b3ea30ad736c';
const API_ROOT_URL = 'https://api.projectoxford.ai/face/v1.0';
const GROUP_ID = 'linka-digitech';

@Injectable()
export class FaceAPIService {

  constructor(private http: Http) {}

  detectFace(dataURI: any) {
    let headers = new Headers({'Content-Type': 'application/octet-stream','Ocp-Apim-Subscription-Key': API_KEY});
    let options = new RequestOptions({ headers: headers });
    let url = API_ROOT_URL+'/detect?returnFaceId=true&returnFaceLandmarks=false';
    let data = CanvasUtils.convertToDataURIToBinary(dataURI);

    return this.http.post(url, data, options)
    .map(res => {
        let faceIds = res.json().map((face:any) => face.faceId);
        if(faceIds.length > 0) {
          return faceIds;
        }
        return [];
      }
    );
  }

  identify(faceIds:any) {
    let headers = new Headers({'Content-Type': 'application/json','Ocp-Apim-Subscription-Key': API_KEY});
    let options = new RequestOptions({ headers: headers });
    let url = API_ROOT_URL+'/identify';
    let data = {personGroupId: GROUP_ID,faceIds,maxNumOfCandidatesReturned: 1};

    return this.http.post(url, data, options)
      .map(res => {
        let personIds = res.json()
        .filter((face:any) => face.candidates.length > 0)
        .map((face:any) => face.candidates[0].personId);
        if(personIds.length > 0) {
          return personIds;
        }
      }
    );
  }

  getPersonNames(personIds:any) {
    let headers = new Headers({'Content-Type': 'application/json','Ocp-Apim-Subscription-Key': API_KEY});
    let options = new RequestOptions({ headers: headers });
    let url = API_ROOT_URL+'/persongroups/'+GROUP_ID+'/persons';

    return this.http.get(url, options)
      .map(res => {
        let name = res.json()
        .filter((person:any) => personIds.indexOf(person.personId) !== -1)
        .map((person:any) => person.name);
        return name;
      });
  }

  deletePerson(personId:any) {
    let headers = new Headers({'Content-Type': 'application/json','Ocp-Apim-Subscription-Key': API_KEY});
    let options = new RequestOptions({ headers: headers });
    let url = API_ROOT_URL+'/persongroups/'+GROUP_ID+'/persons/'+personId;

    return this.http.delete(url,options);
  }

  trainGroup() {
    let headers = new Headers({'Ocp-Apim-Subscription-Key': API_KEY});
    let options = new RequestOptions({ headers: headers });
    let url = API_ROOT_URL+'/persongroups/'+GROUP_ID+'/train';
    let data = "{body}";

    return this.http.post(url,data,options);
  }

  registerPhoto(name:any) {
    let headers = new Headers({'Content-Type': 'application/json','Ocp-Apim-Subscription-Key': API_KEY});
    let options = new RequestOptions({ headers: headers });
    let url = API_ROOT_URL+'/persongroups/'+GROUP_ID+'/persons';
    let data = {name};

    return this.http.post(url,data,options)
      .map(res => {
        return res.json().personId;
      });
  }

  persistedFacesDataURI(res:any,dataURI:any) {
    let headers = new Headers({'Content-Type': 'application/octet-stream','Ocp-Apim-Subscription-Key': API_KEY});
    let options = new RequestOptions({ headers: headers });
    let url = API_ROOT_URL+'/persongroups/'+GROUP_ID+'/persons/'+res+'/persistedFaces';
    let data = CanvasUtils.convertToDataURIToBinary(dataURI);
    return this.http.post(url,data,options)
      .map(res => {
        return res.json().persistedFaceId;
      });
  }

  persistedFacesBlob(res:any,blob:any) {
    let headers = new Headers({'Content-Type': 'application/octet-stream','Ocp-Apim-Subscription-Key': API_KEY});
    let options = new RequestOptions({ headers: headers });
    let url = API_ROOT_URL+'/persongroups/'+GROUP_ID+'/persons/'+res+'/persistedFaces';
    let data = blob;
    return this.http.post(url,data,options)
      .map(res => {
        return res.json().persistedFaceId;
      });
  }
}
