const fetch = require('node-fetch')

const API_KEY = 'eb8bc9e352f6421f9dc3b3ea30ad736c';
const API_ROOT_URL = 'https://api.projectoxford.ai/face/v1.0';
const GROUP_ID = 'linka-digitech';
const util = require('util')

function FaceAPI (){

	this.detectFace = function(data){
		let headers = {'Content-Type': 'application/octet-stream','Ocp-Apim-Subscription-Key': API_KEY};
    let url = API_ROOT_URL+'/detect?returnFaceId=true&returnFaceLandmarks=false';
		return fetch(`${url}`, {
			method : 'POST',
			headers : headers,
			body : data
		})
		.then( results => {return results.json()} )
		.then( results => {
				let faceIds = results.map((face) => face.faceId);
				if(faceIds.length > 0) {
					return faceIds;
				}
				return [];
			}
		).catch(e => console.log(e));
	}

	this.identify = function(faceIds) {
    let headers = {'Content-Type': 'application/json','Ocp-Apim-Subscription-Key': API_KEY};
    let url = API_ROOT_URL+'/identify';
    let data = {personGroupId: GROUP_ID,faceIds,maxNumOfCandidatesReturned: 1};

    // return this.http.post(url, data, options)
    //   .map(res => {
    //     let personIds = res.json()
    //     .filter((face) => face.candidates.length > 0)
    //     .map((face) => face.candidates[0].personId);
    //     if(personIds.length > 0) {
    //       return personIds;
    //     }
    //   }
    // );

		return fetch(`${url}`, {
			method : 'POST',
			headers : headers,
			body : data
		}).then(results => results.map( res => {
			let personIds = res.json()
			.filter((face) => face.candidates.length > 0)
			.map((face) => face.candidates[0].personId);
			if(personIds.length > 0) {
        return personIds;
      }
		}))
  }

  this.getPersonNames = function(personIds) {
    let headers = {'Content-Type': 'application/json','Ocp-Apim-Subscription-Key': API_KEY};
    let url = API_ROOT_URL+'/persongroups/'+GROUP_ID+'/persons';


		return fetch(`${url}`, {
			method : 'GET',
			headers : headers
		}).then(results => results.map( res => {
			let name = res.json()
			.filter((person) => personIds.indexOf(person.personId) !== -1)
			.map((person) => person.name);
			return name;
		}))
  }

  this.deletePerson = function(personId) {
    let headers = {'Content-Type': 'application/json','Ocp-Apim-Subscription-Key': API_KEY};
    let url = API_ROOT_URL+'/persongroups/'+GROUP_ID+'/persons/'+personId;

		return fetch(`${url}`, {
			method : 'DELETE',
			headers : headers
		});
  }

  this.trainGroup = function() {
    let headers = {'Ocp-Apim-Subscription-Key': API_KEY};
    let url = API_ROOT_URL+'/persongroups/'+GROUP_ID+'/train';
    let data = "{body}";

		return fetch(`${url}`, {
			method : 'POST',
			headers : headers,
			body : data
		})
  }

  this.registerPhoto = function(name) {
    let headers = {'Content-Type': 'application/json','Ocp-Apim-Subscription-Key': API_KEY};
    let url = API_ROOT_URL+'/persongroups/'+GROUP_ID+'/persons';
    let data = {name};

		return fetch(`${url}`, {
			method : 'POST',
			headers : headers,
			body : data
		}).then( results => results.map( res => {
			return res.json().personId;
		}));
  }


  // this.persistedFacesDataURI = function(res,dataURI) {
  //   let headers = {'Content-Type': 'application/octet-stream','Ocp-Apim-Subscription-Key': API_KEY};
  //   let options = new RequestOptions({ headers: headers });
  //   let url = API_ROOT_URL+'/persongroups/'+GROUP_ID+'/persons/'+res+'/persistedFaces';
  //   let data = CanvasUtils.convertToDataURIToBinary(dataURI);
  //   return this.http.post(url,data,options)
  //     .map(res => {
  //       return res.json().persistedFaceId;
  //     });
  // }

  this.persistedFacesBlob = function(res,blob) {
    let headers = {'Content-Type': 'application/octet-stream','Ocp-Apim-Subscription-Key': API_KEY};
    let url = API_ROOT_URL+'/persongroups/'+GROUP_ID+'/persons/'+res+'/persistedFaces';
    let data = blob;
		return fetch(`${url}`, {
			method : 'POST',
			headers : headers,
			body : data
		}).then( results => results.map( res => {
			return res.json().persistedFaceId;
		}));
  }

}

module.exports = FaceAPI;
