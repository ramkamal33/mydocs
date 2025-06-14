import { Injectable } from '@angular/core';
import { FileListComponent } from '../file-list.component';

@Injectable({
  providedIn: 'root'
})
export class FilesListService {
  data:filesDaata[] | undefined;

  constructor() { }
  InitializeThankYouComponent( component :FileListComponent)
  {
    this.data = [];
    this.data = component.data;
    

  }
}

class  filesDaata
{
  name: string  ;
  preview: boolean ;
  delete:string ;
  age:number;
  constructor()
  {
    this.name= "";
    this.preview= true;
    this.delete= "";
    this.age= 0;
  }
}
