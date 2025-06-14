import { ai_service_url, api_file_upload_url, api_url_Youtube, api_url_mongodb } from "../Models/constants";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { Batchupdate } from '../Models/file-explorer-model';
import { videodata } from '../Models/file-upload-models';

export interface toastPayload {
  message: string;
  title: string;
  ic: IndividualConfig;
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class CommonService {

 
  public videoList: videodata[] = [];
  public videoids: string[] = [];

  constructor(private toastr: ToastrService, private http: HttpClient,private spinnerService: NgxSpinnerService) { }

  getYoutubeVideoListFromKeyword(keywords: string[]): Observable<videodata[]> {
    this.spinnerService.show();
    this.http.post<videodata[]>(api_url_Youtube, keywords).subscribe(data => {
      this.videoList = data as videodata[];
      console.log("video list" + JSON.stringify(this.videoList));
      //return this.videoList;
      this.spinnerService.hide();
    });
   
    return of(this.videoList);

  }



  getYoutubeVideoListFromFileName(filename: string): Observable<string[]> {


    this.http.get<any>(api_url_mongodb + filename).subscribe(result => {
      //videoids = result.videourls;
      this.videoids = [];
      this.videoids.forEach(x=>this.videoids.pop());
      result.forEach((element: { videourls: any; }) => {
        element.videourls.forEach((x: string) => {
          this.videoids.push(x);
        });
      });

    });
    return of(this.videoids)
  }
  public updateMongoDBFileInfo(fileAdditonalData: any) {
    {
      this.spinnerService.show();
       const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
          }

      this.http.post(api_url_mongodb, JSON.stringify(fileAdditonalData) , httpOptions).subscribe(result => {
            Swal.fire(
              'Sucess....!',
              'Getting related keywords for pdf file using AI tools',
            'success'
              
            )
            
          });
        
    }
  }
  copyFileToMyFiles(filename:string , userid:string): Observable<string[]> {
    this.http.get<any>(api_file_upload_url + '/CopyBlob?filename=' + filename + "&userid=" + userid).subscribe(result => {
      Swal.fire( "Copy sucess", "Copied file" + filename , "success");
      
    });
    return of(this.videoids)
  } 
  BatchUpdateFiles(files: string[], category: string ,userid: string): Observable<string[]> {
    let batchupdate = new Batchupdate();
    batchupdate.filenames = files;
    batchupdate.newvalue = category    
    batchupdate.colnam = "filecategory";
    batchupdate.userid = userid;
    
    console.log("batch update " + JSON.stringify(batchupdate));
    this.http.put<any>(api_url_mongodb , batchupdate).subscribe(result => {
      //Swal.fire( "Batch update sucess", "Updated files" + files , "success");
      
    });
    return of(this.videoids)
  }

  showToast(toast: toastPayload) {
    this.toastr.show(
      toast.message,
      toast.title,
      toast.ic,
      'toast-' + toast.type
    );
  }
}
 