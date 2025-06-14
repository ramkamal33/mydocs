import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FileListComponent} from './file-list/file-list.component'
import { FileuploadComponent } from "./file-upload/file-upload.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { LoginButtonComponent } from "./login-button/login-button.component";
import { LogoutButtonComponent } from "./logout-button/logout-button.component";
import { provideAuth0 } from '@auth0/auth0-angular';
import { HttpClientModule } from '@angular/common/http'
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TabledisplayComponent } from './tabledisplay/tabledisplay.component';
import { FilesExplorerComponent } from './files-explorer/files-explorer.component';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from "@angular/material/input"; 
import { MatChipsModule } from "@angular/material/chips"; 
import { MatIconModule } from '@angular/material/icon'; 
import {DemoMaterialModule} from './file-upload/meterial-modules';
import {  ReactiveFormsModule } from '@angular/forms';
import { PlayYoutubeVideoDialogComponent } from './play-youtube-video-dialog-component/play-youtube-video-dialog-component.component';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileTagsComponent} from './file-tags/file-tags.component'
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    
    AppComponent,
    TabledisplayComponent,
    FilesExplorerComponent,
    


  
  ],
  imports: [
    ReactiveFormsModule,
    DemoMaterialModule,
    MatChipsModule,
    MatInputModule,
    MatIconModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FormsModule,
    NgxDatatableModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FileuploadComponent,
    FileListComponent,
    UserProfileComponent,
    LoginButtonComponent,
    LogoutButtonComponent,
    FileTagsComponent,
    NgxSpinnerModule.forRoot({ type: 'square-jelly-box' }),
],
  providers: [
    
    provideAuth0({
    domain: 'panchu.au.auth0.com',
    clientId: 'nnC1nPUIsJYbUSTPtTOREfDzjL0gfZ4I',
    skipRedirectCallback:false,
    authorizationParams: {
   //redirect_uri: "http://localhost:4200/"
   redirect_uri:"https://talashlogs.z26.web.core.windows.net/"
    
    }
  }),],
  bootstrap: [AppComponent]
})
export class AppModule { }
