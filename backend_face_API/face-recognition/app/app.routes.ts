import { Routes } from '@angular/router';
import { DetectComponent } from './components/detect/Detect';
import { AddPersonComponent } from './components/add-person/AddPerson';
import { FacesImporterComponent } from './components/faces-importer/FacesImporter';
import { AnalyseImageComponent } from './components/analyse-image/AnalyseImage';
export const ROUTES: Routes = [
  { path: '', component: DetectComponent },
  { path: 'add-person', component: AddPersonComponent },
  { path: 'faces-importer', component: FacesImporterComponent },
  { path: 'analyse', component: AnalyseImageComponent }
];
