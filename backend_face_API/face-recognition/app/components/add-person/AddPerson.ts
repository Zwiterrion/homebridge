import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FaceAPIService } from '../../services/FaceAPIService';

@Component({
  selector: 'addPerson',
  templateUrl: './add-person.html',
  providers: [FaceAPIService]
})
export class AddPersonComponent {
  @ViewChild("video") video:ElementRef;
  @ViewChild("canvas") canvas:ElementRef;

  name="";

  constructor (private FaceAPIService: FaceAPIService) {
  }

  ngAfterViewInit() {
    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;

    const nav = <any>navigator;
    nav.getUser = (nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia || nav.msGetUserMedia);

    if(nav.mediaDevices && nav.mediaDevices.getUserMedia) {
    nav.mediaDevices.getUserMedia({ video: true, audio: false })
                          .then((stream:any) => {
                            video.src = window.URL.createObjectURL(stream);
                            video.play();
                          })
    }
  }

  extractImageFromWebCam() {
    const canvas = this.canvas.nativeElement;
    const video = this.video.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    return canvas.toDataURL('image/png');
  }

  addNewPerson() {
    const dataURI = this.extractImageFromWebCam();

    this.FaceAPIService.registerPhoto(this.name)
      .subscribe(data => {
        this.FaceAPIService.persistedFacesDataURI(data,dataURI)
          .subscribe(() => {
            this.FaceAPIService.trainGroup().subscribe();
            delete this.name;
          });
      });
  }
}
