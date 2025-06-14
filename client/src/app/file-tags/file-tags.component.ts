import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { PlayYoutubeVideoDialogComponent } from '../play-youtube-video-dialog-component/play-youtube-video-dialog-component.component';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from "@angular/material/input";
import { MatSelect } from '@angular/material/select';
import { filesearchattributesdata } from '../Models/file-tags-model';
import { Bookmark, videodata } from '../Models/file-upload-models';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-file-tags',

  templateUrl: './file-tags.component.html',
  styleUrl: './file-tags.component.css',
  imports: [MatCheckbox, CommonModule, FormsModule, MatInputModule, MatIconModule, MatSelect, MatChipsModule, ReactiveFormsModule]
})
export class FileTagsComponent {

  @Input() fname: string = "";

  private ai_service_url = "https://groupdiscussion-aebnhpc7fdhrbcc2.australiasoutheast-01.azurewebsites.net/PdfToKeywords"
  api_url_mongodb: string = "https://discussion-eac4ethedca0a0dx.australiaeast-01.azurewebsites.net/DBSearch"
  // api_url_mongodb : string = "https://localhost:7094/DBSearch"

  videoList: videodata[] = [];
  listOfKeywords: string[] = [];
  public suggestedKeywordsByAIService: string[] = [];
  public newKeyword: string = "";
  fileAdditonalData!: filesearchattributesdata;
  category: string = "Other";

  userid: string = 'Ananymous';
  innerWidth: number = 700;
  removable = true;
  bookmark: Bookmark | undefined;
  showVideoList: boolean = false;
  myForm!: FormGroup;

  constructor(private http: HttpClient, private readonly dialog: MatDialog, private fb: FormBuilder,
    private commonService: CommonService) {
    this.listOfKeywords.push("Azure");
    this.listOfKeywords.push("Aws");
    this.listOfKeywords.push("Google Cloud");
    this.fileAdditonalData = {
      username: "", keywords: [], videourls: [], fileName: "", fileCategory: ""
    };
    this.createForm();
  }

  createForm() {
    this.myForm = this.fb.group({
      // fileCategory: new FormControl('', Validators.compose([
      // //  Validators.required,

      // ])),
      fileslist: []
      //  email: ['', Validators.required ]
    });
  }
  //Handler for get videos button click and gets video from youtube api
  get1videolist() {

    Swal.fire(
      'Loading....!',
      'Getting related Video list from youtube!',
      'info'
    )
    this.videoList = [];
    this.commonService.getYoutubeVideoListFromKeyword(this.listOfKeywords).subscribe(data => {
      this.videoList = [];
      this.videoList = data as videodata[];
    });
    console.log("video list" + JSON.stringify(this.videoList));

  }
  //Handler for get keywords button click and gets key words from AI service 
  getKeyWords() {
    Swal.fire(
      'Loading....!',
      'Getting related keywords for pdf file using AI tools',
      'info'
    )
    let filename = "Setting up a managed container cluster with AKS and Kubernetes in the #Azure Cloud running .NET Core in minutes";

    this.http.post(this.ai_service_url + "?userid=" + this.userid + "&filename=" + this.fname, { "filename": this.fname, "userid": this.userid }).subscribe(result => {
      var k = JSON.parse(JSON.stringify(result))
      console.log("getkeywords");

      let mm = k.splice(",");
      let kk = JSON.stringify(mm).split(".");
      
      kk.forEach(element => {
        this.suggestedKeywordsByAIService.push(element);
      })
    }
    )
  }

  //Save data to Mongo db after all validations.
  UpdateFileAdditionalInfo() {
    this.listOfKeywords.forEach(element => {
      this.fileAdditonalData.keywords.push(element);
    })
    //Save data to DB
    this.commonService.updateMongoDBFileInfo(this.fileAdditonalData);

  }
 //willplay help video .
  playYoutubeVideo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    let relativeWidth = (this.innerWidth * 80) / 100; // take up to 80% of the screen size
    if (this.innerWidth > 1500) {
      relativeWidth = (1500 * 80) / 100;
    } else {
      relativeWidth = (this.innerWidth * 80) / 100;
    }

    const relativeHeight = (relativeWidth * 9) / 16 + 120; // 16:9 to which we add 120 px for the dialog action buttons ("close")
    dialogConfig.width = relativeWidth + 'px';
    dialogConfig.height = relativeHeight + 'px';
    dialogConfig.data = {
      bookmark: this.bookmark
    };
    const dialogRef = this.dialog.open(PlayYoutubeVideoDialogComponent, dialogConfig);
  }
  
 //CheckBox clieck  event to add video data to link to PDF file 
  UpdateFileRelatedVideoInfo(video: string) {
    
    this.fileAdditonalData.username = this.userid;
    this.fileAdditonalData.fileName = this.fname;
    this.fileAdditonalData.fileCategory = this.category;
    this.fileAdditonalData.videourls.push(video);
    console.log("file with videos " + JSON.stringify(this.fileAdditonalData));
  }
  //on change file category event from drop down .
  SaveFileCategory(event: any) {
    this.category = event.target.value;
    this.fileAdditonalData.fileCategory = this.category;
    
    
  }

  removeOption(option: string) {
    this.removable = true;
    this.removable = true;
    const index = this.listOfKeywords.indexOf(option);
    if (index >= 0) {
      this.listOfKeywords.splice(index, 1);
    }
  }
  AddNewKey() {
    this.listOfKeywords.push(this.newKeyword)
  }

  updateFileName(event: any) {
    this.fname = event.target.value;
  }

  updateKeywords(event: any) {
    this.newKeyword = event.target.value;
  }  
}

