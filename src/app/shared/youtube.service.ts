import { Video } from './video.model';
import { List } from './list.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  constructor(private http: HttpClient) { }

  searchVideos(q: string, pageToken: string): Observable<List> {
    return this.http.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'id,snippet',
        type: 'video',
        key: environment.youtubeKey,
        q,
        pageToken
      }
    }).pipe(
      take(1),
      map((result: any) =>
        new List(q, result.items.map((video: any) =>
          new Video(
            video?.id?.videoId,
            video?.snippet?.title,
            video?.snippet?.description,
            video?.snippet?.thumbnails?.default?.url
          )),
          result.nextPageToken,
          result.prevPageToken
        ))
    );
  }


  getVideo(id: string): Observable<Video> {
    return this.http.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,statistics',
        key: environment.youtubeKey,
        id
      }
    }).pipe(
      take(1),
      map((video: any) =>
        new Video(
          video?.items[0]?.id,
          video?.items[0]?.snippet?.title,
          video?.items[0]?.snippet?.description,
          video?.items[0]?.snippet?.thumbnails?.default?.url
        ))
    );
  }
}
