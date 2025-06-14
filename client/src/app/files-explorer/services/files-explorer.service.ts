import { Injectable } from '@angular/core';

import { FilesExplorerComponent } from '../files-explorer.component';

@Injectable({
  providedIn: 'root',
})
export class FilesExplorerService {
  data: filesDaata[] | undefined;

  constructor() {}
  InitializeThankYouComponent(component: FilesExplorerComponent) {
    this.data = [];
    this.data = component.data;
  }
}

class filesDaata {
  name: string;
  preview: boolean;
  delete: string;
  age: number;
  constructor() {
    this.name = '';
    this.preview = true;
    this.delete = '';
    this.age = 0;
  }
}
