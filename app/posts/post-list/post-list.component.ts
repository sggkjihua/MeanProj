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
  isLoading = true;
  private postsSub: Subscription;
  constructor(public postService: PostService) {
  }
  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdatedListener()
    .subscribe((posts: Post[]) => {
      this.posts = posts;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
  // posts = [
  //   {title: 'first post', content: 'This is the first post'},
  //   {title: 'second post', content: 'This is the second post'}
  // ];
  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }
}
