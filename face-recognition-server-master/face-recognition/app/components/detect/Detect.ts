import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FaceAPIService } from '../../services/FaceAPIService';
import {Router} from '@angular/router';
const INTERVAL = 20000;

@Component({
  selector: 'detect',
  templateUrl: './detect.html',
  providers: [FaceAPIService],
  host: {'(document:keydown)':'handleKeyboardEvents($event)'}
})

export class DetectComponent implements AfterViewInit {

  @ViewChild("video") video:ElementRef;
  @ViewChild("canvas") canvas:ElementRef;

  displayOptions = {
    showWebcam: false,
    showMenu: false,
    loading: false,
  };
  client = {
    name: '',
  };

  handleKeyboardEvents(event: KeyboardEvent) {
        let key = event.which || event.keyCode;
        if(key === 32) {
          this.recognize();
        }
    }

  constructor (private FaceAPIService: FaceAPIService, private router: Router) {
    setInterval(() => { this.recognize() }, INTERVAL);
  }

  ngAfterViewInit() {
    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;

    const nav = <any>navigator;
    nav.getUserMedia = ( nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia  || nav.msGetUserMedia );

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

  recognize() {
    const dataURI = this.extractImageFromWebCam();
    this.displayOptions.loading = true;

    //detectFace
    this.FaceAPIService.detectFace(dataURI)
      .subscribe(data => {
        if(data.length > 0) {

          //identify
          this.FaceAPIService.identify(data)
            .subscribe(data => {
              //getName
              this.FaceAPIService.getPersonNames(data)
                .subscribe(data => {
                  if(data.length > 0) {
                    this.client.name = data.join(', ');
                  } else {
                    this.router.navigate(['/']);
                  }
                });

            });
        } else {
          this.client.name = '';
          this.router.navigate(['/']);
        }

        this.displayOptions.loading = false;
      },
      (error) => {
        this.displayOptions.loading = false;
      });
  }

}
