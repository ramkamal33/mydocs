import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTagsComponent } from './file-tags.component';

describe('FileTagsComponent', () => {
  let component: FileTagsComponent;
  let fixture: ComponentFixture<FileTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileTagsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
