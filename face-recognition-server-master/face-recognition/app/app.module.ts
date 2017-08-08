import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { RouterModule }   from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { ROUTES } from './app.routes';

import { AppComponent } from './home/app.components';
import { DetectComponent } from './components/detect/Detect';
import { AddPersonComponent } from './components/add-person/AddPerson';
import { FacesImporterComponent } from './components/faces-importer/FacesImporter';
import { AnalyseImageComponent } from './components/analyse-image/AnalyseImage';

import { FaceAPIService } from './services/FaceAPIService';
import { EmotionPreviewAPI } from './services/EmotionPreviewAPI';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(ROUTES)
  ],
  declarations: [
    AppComponent,
    DetectComponent,
    AddPersonComponent,
    FacesImporterComponent,
    AnalyseImageComponent
  ],
  providers: [ FaceAPIService, EmotionPreviewAPI ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
