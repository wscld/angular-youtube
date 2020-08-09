import { Video } from './video.model';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { YoutubeService } from './youtube.service';
import { Observable, of } from 'rxjs';

describe('YoutubeService', () => {
  let service: YoutubeService;

  beforeEach(() => {
    const fakeHttp: any = jasmine.createSpyObj('HttpClient', ['get']);
    const stubValue: Observable<any> = of({
      id: 'id',
      items: [
        {
          id: {
            videoId: 'id'
          },
          snippet: {
            title: '',
            description: '',
          }
        }
      ]
    });
    fakeHttp.get.and.returnValue(stubValue);
    service = new YoutubeService(fakeHttp);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load a video', () => {
    service.getVideo('id').subscribe(video => {
      expect(video.id).toBeDefined();
    });
  });

  it('should load a list', () => {
    service.searchVideos('term', '').subscribe(video => {
      expect(video.videos.length).toBeGreaterThanOrEqual(1);
    });
  });
});
