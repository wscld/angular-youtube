import { YoutubeService } from './../../shared/youtube.service';
import { Video } from './../../shared/video.model';
import { map, tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  state$: Observable<any>;
  video: Video;
  videoUrl: SafeHtml;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private youtube: YoutubeService) { }

  ngOnInit(): void {
    const videoId = this.route.snapshot.paramMap.get('id');

    this.state$ = this.route.paramMap
      .pipe(map(() => window.history.state));

    this.subscription = this.state$.subscribe((data: any) => {
      if (data.id && !this.video) {
        this.video = data;
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.video.id}`);
      } else {
        this.getVideo(videoId);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  getVideo(id: string) {
    this.youtube.getVideo(id).subscribe((data: Video) => {
      if (data) {
        this.video = data;
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.video.id}`);
        console.log(this.videoUrl);
      }
    });
  }

}
