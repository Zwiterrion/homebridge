import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AnalyseImageAPIService } from '../../services/AnalyseImageAPIService';
import { EmotionPreviewAPI } from '../../services/EmotionPreviewAPI';
import {Router} from '@angular/router';

const COLORS = ['red', 'blue', 'yellow', 'green'];

@Component({
  selector: 'analyse',
  templateUrl: './analyse-image.html',
  providers: [AnalyseImageAPIService]
})

export class AnalyseImageComponent implements AfterViewInit {
  analysing=false;
  @ViewChild("video") video:ElementRef;
  @ViewChild("canvas") canvas:ElementRef;

  constructor (private AnalyseImageAPIService: AnalyseImageAPIService, private EmotionPreviewAPI: EmotionPreviewAPI) {

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

  analyse() {
    this.analysing=true;
    const dataURI = this.extractImageFromWebCam();
    const canvas = this.canvas.nativeElement;
    const canvasContext = canvas.getContext('2d');

    this.AnalyseImageAPIService.analyse(dataURI)
      .subscribe((faces)=> {
        faces.forEach((face:any, index:any) => {
          const color = COLORS[index % COLORS.length];
          console.log(JSON.stringify(face));
          canvasContext.beginPath();
          console.log(face.faceRectangle.left, face.faceRectangle.top,
            face.faceRectangle.width, face.faceRectangle.height);
          canvasContext.rect(face.faceRectangle.left, face.faceRectangle.top,
            face.faceRectangle.width, face.faceRectangle.height);
          canvasContext.lineWidth = 3;
          canvasContext.strokeStyle = color;
          canvasContext.stroke();
          canvasContext.fillStyle = color;
          canvasContext.font = '30px Arial';
          canvasContext.fillText(
            `${face.gender === 'Male' ? 'Homme'
              : 'Femme'}, ${face.age} ans`,
            face.faceRectangle.left, face.faceRectangle.top - 10);
          console.log('stroke');
        });
      });

    this.EmotionPreviewAPI.previewEmotions(dataURI)
      .subscribe((emotions)=> {
        emotions.forEach((emotion:any,index:any) => {
          const color = COLORS[index % COLORS.length];

          canvasContext.fillStyle = color;
          canvasContext.font = '30px Arial';
          canvasContext.fillText(
            emotion.emotion,
            emotion.faceRectangle.left + 5, emotion.faceRectangle.top
              + emotion.faceRectangle.height + 35);
        });
      })
  }

  reset() {
    this.analysing=false;
  }
}
