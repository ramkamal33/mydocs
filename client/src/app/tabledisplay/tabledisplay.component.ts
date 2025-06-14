import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { FilesExplorerService } from '../files-explorer/services/files-explorer.service';
import { filesDaata } from '../Models/file-explorer-model';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-tabledisplay',
  standalone: false,
  templateUrl: './tabledisplay.component.html',
  styleUrl: './tabledisplay.component.css'
})
export class TabledisplayComponent {

  @ViewChild(DatatableComponent)
  api_url_mongodb: string = "https://discussion-eac4ethedca0a0dx.australiaeast-01.azurewebsites.net/DBSearch"
  typeSelected: string = "square-jelly-box";
  red:string = "red";
  loading:string = "Loading...";
  table!: DatatableComponent;
  @Output() dataEvent = new EventEmitter<string>();
  @Input() rows: filesDaata[] = [];
  @Input() message: string | undefined;
  public selected: any[] = [];
  public isLoading = false;
  public category: string = "Other";
  pageSize: number = 5;
  userid: string = "Ananymous";

  constructor(public fileListService: FilesExplorerService, public http: HttpClient, private auth: AuthService, 
    private cs: CommonService ,private spinnerService: NgxSpinnerService) {
    fileListService.data?.forEach(element => {

      this.rows.push(element);
      this.getUserId();
    });
  }

  temp = this.rows;
  ColumnMode = ColumnMode;
  refreshData() {

  }
  //------------------------------------------------------------------------------------------------------
  //click events on table  based on table preview, save files to my files and delete file
  //-------------------------------------------------------------------------------------------------------- 

  public onCheckboxChange(event: any, row: any): void {
    // Update parent with file name selected.   
    this.dataEvent.emit(row.name);
  }

  //checkbox client event for save files to myfiles 
  async SaveFileToMyFiles(vent: any, row: any) {
    let k = await this.getUserId();
    if (this.userid == "Ananymous") {
      Swal.fire("This feature only for logged in users", "Please login to save files to my files", "info");
      return;
    }
    this.cs.copyFileToMyFiles(row.name, this.userid);
  }

  public getChecked(row: any): boolean {
    // autofill checked
    const item = this.selected.filter((e) => e.id === row.id && e.site_code === row.site_code);
    return item.length > 0 ? true : false;
  }
  //------------------------------------------------------------------------------------------------------
  //Search events based on file name, category and file type
  //--------------------------------------------------------------------------------------------------------
  // filtering table by category clieck event for dropdown  to search files
  FilterByCategory(event: any) {
    // const val = event.target.value.toLowerCase();
    this.spinnerService.show();
    this.category = event.target.value;

    let url = this.api_url_mongodb + "/Other/Other?category=";
    
    this.http.get<any[]>("https://discussion-eac4ethedca0a0dx.australiaeast-01.azurewebsites.net/DBSearch" + "/" + this.category + "/" + this.category).subscribe((result: any) => {
      console.log(JSON.stringify(result));
      this.rows = [];

      result.forEach((element: any) => {
        let obj = new filesDaata();
        
        obj.name = element.fileName;
        console.log("file name " + obj.name);
        this.rows.push(obj);
        this.spinnerService.hide();
      });

    });
    setTimeout(() => {
      this.spinnerService.hide();
    }, 1000); // 5 seconds
  }


  // filtering table by file name clieck event for text box to search filenames
  updateFilter(event: any) {
    this.spinnerService.show();
    const val = event.target.value.toLowerCase();
    const temp = this.rows.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
   // this.table.offset = 0;
  }
  //------------------------------------------------------------------------------------------------------
  //Other events and useful fucnitons
  //--------------------------------------------------------------------------------------------------------
  getRowClass = (row: any) => {

    return {
      'row-color': true
    };
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
  //ui selection for table size
  SaveFileSize(event: any) {
    this.pageSize = event.target.value;
  }

  getPageSize() {
    return this.pageSize;
  }
}
