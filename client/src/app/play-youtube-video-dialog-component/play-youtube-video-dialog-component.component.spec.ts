import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayYoutubeVideoDialogComponent } from './play-youtube-video-dialog-component.component';

describe('PlayYoutubeVideoDialogComponentComponent', () => {
  let component: PlayYoutubeVideoDialogComponent;
  let fixture: ComponentFixture<PlayYoutubeVideoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayYoutubeVideoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayYoutubeVideoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
