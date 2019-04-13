import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../Post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './post-list.component.html',
  selector: 'app-post-list',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;
  constructor(public postService: PostService) {
  }
  ngOnInit() {
    this.posts = this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdatedListener()
    .subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
  // posts = [
  //   {title: 'first post', content: 'This is the first post'},
  //   {title: 'second post', content: 'This is the second post'}
  // ];
}
