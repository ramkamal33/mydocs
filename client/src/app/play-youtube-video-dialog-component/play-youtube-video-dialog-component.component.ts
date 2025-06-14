import { Component, Inject, OnInit } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';


import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatDialog,MatDialogModule} from '@angular/material/dialog';


@Component({
  selector: 'app-play-youtube-video-dialog',
  templateUrl: './play-youtube-video-dialog-component.component.html',
  styleUrls: ['./play-youtube-video-dialog-component.component.css'],
  imports: [MatDialogModule],
})
export class PlayYoutubeVideoDialogComponent implements OnInit {

 // bookmark: Bookmark;
  safeUrl: any;

  constructor(
    private dialogRef: MatDialogRef<PlayYoutubeVideoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _sanitizer: DomSanitizer
  ) {
    //this.bookmark = data.bookmark;
    this.safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/Iz4QMwdf2og`);
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close('Play Youtube Video Closed');
  }

}
export interface Bookmark {
  _id?: string;
  shareableId?: string;
  name: string;
  location: string;
  type: string; // should always be 'bookmark'
  tags: string[];
  initiator?: string;
  description?: string;
  descriptionHtml?: string;
  tagsLine?: string;
  publishedOn?: Date;
  sourceCodeURL?: string;
  userId?: string;
  userDisplayName: string;
  public?: boolean;
  language?: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastAccessedAt?: Date;
  ownerVisitCount?: number;
  likeCount?: number;
  youtubeVideoId?: string;
  stackoverflowQuestionId?: string;
}