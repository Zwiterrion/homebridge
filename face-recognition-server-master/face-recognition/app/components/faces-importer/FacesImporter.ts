const BATCH_SIZE = 8;
const IMPORT_BATCH_TIMEOUT = 10000;
import { FaceAPIService } from '../../services/FaceAPIService';
import { Component } from '@angular/core';
@Component({
  selector: 'faceImporter',
  templateUrl: './faces-importer.html',
  providers: [FaceAPIService]
})
export class FacesImporterComponent {

  constructor (private FaceAPIService: FaceAPIService) {
  }

  fileNameToPersonName(fileName:any) {
    return fileName.replace(/\.[^/.]+$/, '')
    .replace(/-/g, '')
    .replace(/(.*)_(.*)/g, '$2 $1')
    .replace(/([A-Z])/g, ' $1')
    .replace(/\s+/g, ' ')
    .trim();
  }

  uploadImages(event:any) {
    let files = [].slice.call(event.target.files);
    files.map((f:any) => {
      this.FaceAPIService.registerPhoto(this.fileNameToPersonName(f.name))
        .subscribe(data => {
          this.FaceAPIService.persistedFacesBlob(data,f.slice(0,f.length))
            .subscribe(data => {
              this.FaceAPIService.trainGroup().subscribe();
            });
        });
    });
  }
}
