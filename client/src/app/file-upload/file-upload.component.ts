import { Component, EventEmitter, OnInit, Output, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, NgFor } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PlayYoutubeVideoDialogComponent } from '../play-youtube-video-dialog-component/play-youtube-video-dialog-component.component';
import { DomSanitizer } from '@angular/platform-browser';
import { FileTagsComponent } from './../file-tags/file-tags.component'
import { Bookmark } from '../Models/file-upload-models';

@Component({
  selector: 'app-fileupload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  imports: [CommonModule, FormsModule, MatInputModule,
    MatTooltipModule, MatDialogModule, FileTagsComponent],
})
export class FileuploadComponent {

  @Output() uploadEvent = new EventEmitter<boolean>();
  private baseUrl = 'https://talashfileuploadapi-ctapfke2bwcwdghx.australiasoutheast-01.azurewebsites.net/api/blobstorage';

  bookmark: Bookmark | undefined;
  removable = true;
  public progress!: number;
  public message!: string;
  fileToUpload: FormData | undefined;
  userid: string = 'Ananymous';
  innerWidth: number = 700;
  public fname: string = "";
  safeUrl: any;

  constructor(private http: HttpClient, private auth: AuthService, private readonly dialog: MatDialog, private _sanitizer: DomSanitizer) {
    this.safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/Iz4QMwdf2og`);
    this.getUserId();
  }

  //------------------------------------------------------------------------------------------------------
  //Play help video on button click event
  //-------------------------------------------------------------------------------------------------------- 
  playYoutubeVideo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = this.calculateDialogWidth() + 'px';
    dialogConfig.height = this.calculateDialogHeight() + 'px';
    dialogConfig.data = {
      bookmark: this.bookmark
    };
    const dialogRef = this.dialog.open(PlayYoutubeVideoDialogComponent, dialogConfig);
  }
  //------------------------------------------------------------------------------------------------------
  //upload files based on user selection
  //-------------------------------------------------------------------------------------------------------- 

  upload(files: any) {
    if (files.length === 0)
      return;

    const formData = new FormData();
    let fname = "";
    for (let file of files) {
      formData.append("asset", file, file.name,);
      fname = file.name;
    }
    this.fileToUpload = formData;
    this.http.post(this.baseUrl + '/insertfile', this.fileToUpload)
      .subscribe((response: any) => {
        if (response == true) {
          this.fname = fname;
          this.setFileAttributes();
        }
        else {
          alert('Error occured!');
        }
      },
        err => console.log(err),
      );
  }

  ngOnChanges(changes: SimpleChanges) {

  }
  //Move file to the user directory
  setFileAttributes(): void {
    this.http.get(`${this.baseUrl}/SetFileAttrib?filename=${this.fname}&userid=${this.userid}&application=talash-drive`)
      .subscribe(() => {
        Swal.fire('Uploaded!', 'Your file has been uploaded.', 'success');
        this.uploadEvent.emit(true);
      });
  }
  //------------------------------------------------------------------------------------------------------
  //other useful fucntions
  //-------------------------------------------------------------------------------------------------------- 
  calculateDialogWidth(): number {
    return this.innerWidth > 1500 ? 1200 : (this.innerWidth * 80) / 100;
  }

  calculateDialogHeight(): number {
    return (this.calculateDialogWidth() * 9) / 16 + 120;
  }

  getUserId() {
    this.auth.isAuthenticated$.subscribe(result => {
      let val = JSON.stringify(result);
      if (val == 'true') {
        this.auth.user$.subscribe(result => {
          if (result?.nickname)
            this.userid = result?.nickname;
        })
      }
    });
  }
  getTooltipText() {
    return `we use AI text Analyser to get summary and then derive keywords and displayed as 
                                suggestions. Keywords can be modified . With same Key Words Youtube API will be used
                                to get related Videos useful along with pdf. Again Key words and Video list can be
                                modified and saved . These key words will `;
  }

}  
