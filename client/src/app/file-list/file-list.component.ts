import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { CommonModule } from '@angular/common';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '@auth0/auth0-angular';
import { concatMap, iif, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TabledisplayComponent } from '../tabledisplay/tabledisplay.component';
import { FilesListService } from './services/files-list.service';
import {ai_service_url,api_file_upload_url,api_url_Youtube,api_url_mongodb} from '../Models/constants';


@Component({


  standalone: true,
  imports: [CommonModule ],
  selector: 'app-file-list',

  templateUrl: './file-list.component.html',


  styleUrl: './file-list.component.css'
})

export class FileListComponent implements OnInit {


  publicFiles: string[] = [];  
  private blobBaseUrl = "https://talashlogs.blob.core.windows.net/talash-drive/";
  public filename: string | undefined; safeSrc: SafeResourceUrl;
  userid: string = "Ananymous";
  data:filesDaata[] | undefined;

  constructor(private http: HttpClient, 
    private sanitizer: DomSanitizer, 
    private auth: AuthService, route: ActivatedRoute ,public fileListService: FilesListService ) {

    route.params.forEach(params => {
      this.refreshList();
    });
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl("https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210101201653/PDF.pdf");
    this.refreshList();

  }

  ngOnInit(): void {

    this.refreshList();
  }
  refreshList() {
    this.auth.isAuthenticated$.subscribe(result => {
      let val = JSON.stringify(result);
      if (val == 'true') {

        this.auth.user$.subscribe(result => {
          if (result?.nickname)
            this.userid = result?.nickname;

          this.publicFiles = [];
          this.http.get<string[]>(api_file_upload_url + '/ListFilesByApplication?userid=' + this.userid + "&applicaiton=talashdrive").subscribe(result => {
            this.publicFiles = result.filter(x => x.includes("pdf"));
            this.convertToTableData();
            this.fileListService.InitializeThankYouComponent(this);          
          
          }, error => console.error(error));
        })



      }
    });
 

  }
  convertToTableData()
  {
  this.data = [];
    this.publicFiles.forEach(element=>{
      let obj = new filesDaata();
      obj.name = element;
      obj.preview = true;
      obj.delete = "";
      this.data?.push(obj);
     

    });
  }
  deleteFile(fileName: string) {

  }

  preview(fName: string) {

    this.filename = "https://drive.google.com/viewerng/viewer?embedded=true&url="+this.blobBaseUrl + fName;
    
    // this.sanitizer.bypassSecurityTrustResourceUrl(this.filename);
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.filename)
    

  }

}
class  filesDaata
{
  name: string  ;
  preview: boolean;
  delete:string ;
  age:number ;
  constructor()
  {
    this.name= "";
    this.preview= false;
    this.delete= "";
    this.age= 0;
  }
  
}