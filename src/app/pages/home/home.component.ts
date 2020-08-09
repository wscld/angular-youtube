import { Observable } from 'rxjs';
import { Video } from './../../shared/video.model';
import { List } from './../../shared/list.model';
import { YoutubeService } from './../../shared/youtube.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { StorageMap } from '@ngx-pwa/local-storage';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('search', [
      state('default', style({
        marginTop: '0px'
      })),
      state('middle', style({
        marginTop: '50%'
      })),
      transition('default => middle', [
        animate('0.5s')
      ]),
      transition('middle => default', [
        animate('0.5s')
      ]),
    ])
  ]
})
export class HomeComponent implements OnInit {
  list: List;
  loading: boolean;

  constructor(private youtube: YoutubeService, private router: Router, private storage: StorageMap) { }

  ngOnInit(): void {
    this.storage.get('data').subscribe((data: List) => {
      if (data) {
        this.list = data;
      }
    });
  }

  onEnter(str: string): void {
    if (str === '') {
      this.list = null;
      this.storage.set('data', null).subscribe(() => {
      });
    } else {
      this.loading = true;
      this.youtube.searchVideos(str, '').subscribe(data => {
        this.loading = false;
        this.list = data;
        this.storage.set('data', data).subscribe(() => {
        });
      });

    }
  }

  onLoadMore(): void {
    this.loading = true;
    this.youtube.searchVideos(this.list.term, this.list.nextPageToken).subscribe(data => {
      this.loading = false;
      this.list.videos = [...this.list.videos, ...data.videos];
      this.list.nextPageToken = data.nextPageToken;
      this.storage.set('data', this.list).subscribe(() => {
      });
    });
  }

  onNavigate(video: Video): void {
    this.router.navigate(['video', video.id], {
      state: video
    });
  }
}
