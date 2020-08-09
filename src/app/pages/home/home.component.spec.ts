import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { VideoComponent } from './../video/video.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { YoutubeService } from './../../shared/youtube.service';
import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { of } from 'rxjs';
import { Location } from '@angular/common';
import { List } from 'src/app/shared/list.model';
import { Video } from 'src/app/shared/video.model';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { isRegExp } from 'util';


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let location: Location;
  const videos: Video[] = [
    new Video('', '', '', ''),
    new Video('', '', '', ''),
    new Video('', '', '', ''),
  ];

  beforeEach(async(() => {
    const fakeYoutubeService = jasmine.createSpyObj('YoutubeService', ['searchVideos']);

    TestBed.configureTestingModule({
      declarations: [HomeComponent, VideoComponent],
      imports: [
        HttpClientModule,
        MatListModule,
        MatCardModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes(
          [
            { path: 'video/:id', component: DummyComponent, pathMatch: 'full' }
          ]
        ),
      ],
      providers: [
        { provide: YoutubeService, useValue: fakeYoutubeService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list videos', () => {
    component.list = new List('test', videos, '', '');
    fixture.detectChanges();
    const items: any[] = fixture.debugElement.queryAll(By.css('.mat-list-item'));

    expect(items.length).toBeGreaterThanOrEqual(1);
  });

  it('should call onNavigate to video on click', () => {
    spyOn(component, 'onNavigate');
    component.list = new List('test', videos, '', '');
    fixture.detectChanges();
    const items: any[] = fixture.debugElement.queryAll(By.css('.mat-list-item'));
    console.log(items[0]);
    items[0].triggerEventHandler('click', null);

    expect(component.onNavigate).toHaveBeenCalled();
  });

  it('should call onLoadMore on click', () => {
    spyOn(component, 'onLoadMore');
    component.list = new List('test', videos, '', '');
    fixture.detectChanges();
    const loadButton = fixture.debugElement.query(By.css('.load-more'));
    loadButton.triggerEventHandler('click', null);

    expect(component.onLoadMore).toHaveBeenCalled();
  });
});

@Component({
  selector: 'app-test',
  template: '',
  styles: []
})
class DummyComponent {
}
