const fetch = require('node-fetch');
// const util = require('util');

const API_KEY = 'eb8bc9e352f6421f9dc3b3ea30ad736c';
const API_ROOT_URL = 'https://api.projectoxford.ai/face/v1.0';
const GROUP_ID = 'linka-digitech';

function FaceAPI() {
//= =============================================================================
  this.detectFace = function detectFace(data) {
    const headers = { 'Content-Type': 'application/octet-stream', 'Ocp-Apim-Subscription-Key': API_KEY };
    const url = `${API_ROOT_URL}/detect?returnFaceId=true&returnFaceLandmarks=false`;
    return fetch(`${url}`, {
      method: 'POST',
      headers,
      body: data,
    })
      .then(results => results.json())
      .then((results) => {
        const faceIds = results.map(face => face.faceId);
        if (faceIds.length > 0) {
          return faceIds;
        }
        return [];
      }
      ).catch(e => console.log(e));
  };
  //= =============================================================================
  this.identify = function identify(faceIds) {
    if (faceIds.length === 0) {
      return [];
    }

    const headers = { 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': API_KEY };
    const url = `${API_ROOT_URL}/identify`;
    let data = { personGroupId: GROUP_ID, faceIds, maxNumOfCandidatesReturned: 1 };
    data = JSON.stringify(data);

    return fetch(`${url}`, {
      method: 'POST',
      headers,
      body: data,
    })
      .then(results => results.json())
      .then((results) => {
        const tab = [];
        for (const i in results) {
          if (results[i].candidates[0]) {
            tab[i] = results[i].candidates[0].personId;
          }
        }
        return tab;
      }
      );
  };
  //= =============================================================================
  this.getPersonNames = function getPersonNames(personIds) {
    if (personIds === []) {
      return [];
    }

    const headers = { 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': API_KEY };
    const url = `${API_ROOT_URL}/persongroups/${GROUP_ID}/persons`;

    return fetch(`${url}`, {
      method: 'GET',
      headers,
    }).then(results => results.json())
      .then((results) => {
        const tab = [];
        for (const i in personIds) {
          for (const j in results) {
            if (results[j].personId === personIds[i]) {
              tab[i] = { id: personIds[i], name: results[j].name };
              break;
            }
          }
        }
        return tab;
      });
  };
  //= =============================================================================
  this.deletePerson = function deletePerson(personId) {
    const headers = { 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': API_KEY };
    const url = `${API_ROOT_URL}/persongroups/${GROUP_ID}/persons/${personId}`;

    return fetch(`${url}`, {
      method: 'DELETE',
      headers,
    });
  };
  //= =============================================================================
  this.trainGroup = function trainGroup() {
    const headers = { 'Ocp-Apim-Subscription-Key': API_KEY };
    const url = `${API_ROOT_URL}/persongroups/${GROUP_ID}/train`;
    const data = '{body}';

    return fetch(`${url}`, {
      method: 'POST',
      headers,
      body: data,
    });
  };
  //= =============================================================================
  this.registerPhoto = function registerPhoto(name) {
    const headers = { 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': API_KEY };
    const url = `${API_ROOT_URL}/persongroups/${GROUP_ID}/persons`;
    const data = { name };

    return fetch(`${url}`, {
      method: 'POST',
      headers,
      body: data,
    }).then(results => results.map(res => res.json().personId));
  };


  // this.persistedFacesDataURI = function(res,dataURI) {
  //   let headers = {'Content-Type': 'application/octet-stream',
  //   'Ocp-Apim-Subscription-Key': API_KEY};
  //   let options = new RequestOptions({ headers: headers });
  //   let url = API_ROOT_URL+'/persongroups/'+GROUP_ID+'/persons/'+res+'/persistedFaces';
  //   let data = CanvasUtils.convertToDataURIToBinary(dataURI);
  //   return this.http.post(url,data,options)
  //     .map(res => {
  //       return res.json().persistedFaceId;
  //     });
  // }
  //= =============================================================================
  this.persistedFacesBlob = function persistedFacesBlob(res, blob) {
    const headers = { 'Content-Type': 'application/octet-stream', 'Ocp-Apim-Subscription-Key': API_KEY };
    const url = `${API_ROOT_URL}/persongroups/${GROUP_ID}/persons/${res}/persistedFaces`;
    const data = blob;
    return fetch(`${url}`, {
      method: 'POST',
      headers,
      body: data,
    }).then(results => results.map(res2 => res2.json().persistedFaceId));
  };
}

module.exports = FaceAPI;
