import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '@auth0/auth0-angular';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { api_file_upload_url } from '../Models/constants';
import { filesDaata } from '../Models/file-explorer-model';
import { CommonService } from '../services/common.service';
import { RefreshService } from '../services/refresh.service';
import { FilesExplorerService } from './services/files-explorer.service';

@Component({
  selector: 'app-files-explorer',
  standalone: false,
  templateUrl: './files-explorer.component.html',
  styleUrl: './files-explorer.component.scss'
})
export class FilesExplorerComponent implements OnInit {

  @Input() refreshData: boolean = true;
  seelctedFiles :string[] = [];
  batchcategory: string = "Other";

  private subscription: Subscription = new Subscription();
  private refreshservice = inject(RefreshService)
  private blobBaseUrl = "https://talashlogs.blob.core.windows.net/talash-drive/";

  myForm!: FormGroup;
  isPublicFile: boolean = true;
  receivedData: string = "";
  userid: string = "Ananymous";
  disableMyfiles: boolean = false;
  data: filesDaata[] = [];
  selectedFiles: string[] = [];
  publicFiles: string[] = [];
  displayFileName: string[] = [];
  public filename!: string;
  safeSrc: SafeResourceUrl;
  emailfiles: string = "";
  videolist: any[] = [];
  public text: string | undefined;


  constructor(private http: HttpClient,
    private sanitizer: DomSanitizer, private auth: AuthService, public fileListService:
      FilesExplorerService, private fb: FormBuilder,
    private cs: CommonService) {
    this.createForm();
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl("https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210101201653/PDF.pdf");
    this.refreshfilesList();
    this.isChecked();
  }

  //------------------------------------------------------------------------------------------------------
  //Initialise form
  //-------------------------------------------------------------------------------------------------------- 
  createForm() {
    this.myForm = this.fb.group({
      email: new FormControl('', Validators.compose([
        //Validators.required,
        //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      fileslist: []
      //  email: ['', Validators.required ]
    });
  }

  ngOnInit(): void {
    this.disableMyfiles = true;

    this.subscription = this.refreshservice.refresh$.subscribe(() => {
      console.log("Refresh event triggered in files explorer component")
      this.refreshfilesList();
    });

    this.refreshfilesList();
  }

  //------------------------------------------------------------------------------------------------------
  //preview pdf file after selecting preview option in file display table
  //-------------------------------------------------------------------------------------------------------- 
  updatePreviewData(data: any) {
    this.videolist = [];
    this.receivedData = data;
    console.log
    this.UpdateVideoList(this.receivedData); 
    this.selectedFiles.push(this.receivedData);  
    

    if (this.userid != "Ananymous") {
      this.filename = "https://drive.google.com/viewerng/viewer?embedded=true&url=" + this.blobBaseUrl + this.userid + this.receivedData;
    }
    else
      this.filename = "https://drive.google.com/viewerng/viewer?embedded=true&url=" + this.blobBaseUrl + this.receivedData;

    //Add to list of selected files.
    let fileFullName = this.filename.replace("https://drive.google.com/viewerng/viewer?embedded=true&url=", "");
   
    this.emailfiles += "                                           " + fileFullName;// + "<a href=\""+ fileFullName +"\">link</a>"
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.filename)

  }

  //Video List data from API : db query to get keywords and video based on file
  UpdateVideoList(filename: string) {
    this.videolist = [];
    this.filename = filename;


    var k = this.cs.getYoutubeVideoListFromFileName(filename).subscribe((result: string[]) => {
      this.videolist = [];
      this.videolist.forEach(X => this.videolist.pop());

      result.forEach(x => this.videolist.push(this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + x)));

    });

    var k = this.cs.getYoutubeVideoListFromFileName(filename).subscribe((result: string[]) => {
      this.videolist = [];
      this.videolist.forEach(X => this.videolist.pop());

      result.forEach(x => this.videolist.push(this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + x)));

    });

  }
  
  //------------------------------------------------------------------------------------------------------
  // Email fucnitonality 
  //-------------------------------------------------------------------------------------------------------- 
  public sendEmail(e: Event) {
    e.preventDefault();
    emailjs
      .sendForm(
        'service_9pbybee',
        'template_gvzq4jx',
        e.target as HTMLFormElement,
        'eE6TlxLSd36jnzO8P'
      )
      .then(
        (result: EmailJSResponseStatus) => {

          Swal.fire('Email Send ');
        },
        (error) => {
          console.log(error.text);
        }
      );
  }
  ngOnChanges(changes: SimpleChanges) {
    this.isChecked();
    this.videolist = [];
    this.videolist.forEach(X => this.videolist.pop());
    //this.UpdateVideoList(this.receivedData);
  }

  //------------------------------------------------------------------------------------------------------
  //Batch updtes to mongo db for file tags and keywords
  //--------------------------------------------------------------------------------------------------------

  UpdateFilecategory(event: any) {
    
    this.getUserId();
    console.log(this.userid);
    if(this.userid == "Ananymous" || this.userid == "" || this.userid == undefined) 
    {
      Swal.fire("This feature only for logged in users", "info");
      return;
    }
    let newcategory = this.batchcategory;
    console.log("file new  category " + newcategory); 
    console.log('file list ;' + JSON.stringify(this.selectedFiles))
    this.cs.BatchUpdateFiles(this.selectedFiles,newcategory,this.userid).subscribe(result => {
      console.log("Batch update files " + JSON.stringify(result));
      Swal.fire("Batch file update sucess", "Files updated successfully", "success");
    });
    
  }
  updateBatchCategory(event: any) {
    this.batchcategory = event.target.value;
  }

  //------------------------------------------------------------------------------------------------------
  //Other fucntionality
  //-------------------------------------------------------------------------------------------------------
  // based on user id get the file list. if user not logged in user id is anonymous.
  refreshfilesList() {

    this.auth.isAuthenticated$.subscribe(result => {

      let val = JSON.stringify(result);
      if (val == 'true') {


        this.auth.user$.subscribe(result => {
          this.disableMyfiles = false;
          if (result?.nickname)
            this.userid = result?.nickname;

          this.publicFiles = [];
          this.http.get<string[]>(api_file_upload_url + '/ListFilesByApplication?userid=' + this.userid + "&applicaiton=talashdrive").subscribe(result => {
            this.publicFiles = result.filter(x => x.includes("pdf"));
            //thisdisplayFileName = this.publicFiles.map(seg => seg.replace(this.userid, '') );
            this.convertToTableData();
            this.fileListService.InitializeThankYouComponent(this);
          }, error => console.error(error));
        })
      }
    });
  }

  convertToTableData() {
    this.data = [];
    this.publicFiles.forEach(element => {
      let obj = new filesDaata();
      obj.name = element.replace(this.userid, "");
      obj.preview = true;
      obj.delete = "";
      this.data?.push(obj);
    });
  }

  isChecked(filetype: string = "") {
    //Check the Console for the Output Weather checkbox is checked or not
    this.isPublicFile = this.isPublicFile == true ? false : true;

    if (filetype != "publicFiles") {
      this.userid = "Ananymous";
    }
    else {
      this.auth.user$.subscribe(result => {
        if (result?.nickname)
          this.userid = result?.nickname;
      })
    }

    this.publicFiles = []; 0
    this.http.get<string[]>(api_file_upload_url + '/ListFilesByApplication?userid=' + this.userid + "&applicaiton=talashdrive").subscribe(result => {
      this.publicFiles = result.filter(x => x.includes("pdf"));
      this.convertToTableData();

    });
  }
  async getUserId() {
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
}


