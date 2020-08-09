import { Video } from './video.model';
export class List {
    term: string;
    videos: Video[];
    nextPageToken: string;
    prevPageToken: string;

    constructor(
        term: string,
        videos: Video[],
        nextPageToken: string,
        prevPageToken: string
    ) {
        this.term = term;
        this.videos = videos;
        this.nextPageToken = nextPageToken;
        this.prevPageToken = prevPageToken;
    }
}
