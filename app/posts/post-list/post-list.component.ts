import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../Post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  templateUrl: './post-list.component.html',
  selector: 'app-post-list',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = true;
  totalPosts = 50;
  pageSize = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private postsSub: Subscription;
  constructor(public postService: PostService) {
  }
  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.pageSize, this.currentPage);
    this.postsSub = this.postService.getPostUpdatedListener()
    .subscribe((postData: { posts: Post[], postCount: number}) => {
      this.posts = postData.posts;
      this.totalPosts = postData.postCount;
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
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.pageSize, this.currentPage);
    });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.postService.getPosts(this.pageSize, this.currentPage);
  }
}
