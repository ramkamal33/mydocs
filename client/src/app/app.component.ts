import { Component, ViewChild } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TalashPDFDrive';
  refreshData:boolean = false;  
  typeSelected: string = "square-jelly-box";
  loading:string = "Loading...";

  constructor(public  auth: AuthService){
  }
  handleDataFromUpload(data: any) {
    this.refreshData = data;
  }
 }
