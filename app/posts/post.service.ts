import { Post } from './Post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
@Injectable({providedIn: 'root'})
export class PostService {
  BACKEND_URL = environment.url + '/posts';
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.http.get<{message: string, posts: any[], maxPosts: number}>(this.BACKEND_URL + queryParams)
    .pipe(map((postData) => {
      return {posts: postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
          creator: post.creator
        };
      }), maxPosts: postData.maxPosts};
    }))
    .subscribe((transformedPostData) => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts});
    });
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(postId: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string,
      creator: string}>(this.BACKEND_URL + '/' + postId);
  }

  addPost(titleAdd: string, contentAdd: string, image: File) {
    const postData = new FormData();
    postData.append('title', titleAdd);
    postData.append('content', contentAdd);
    postData.append('image', image, titleAdd);
    // const post: Post = {id: null, title: titleAdd, content: contentAdd};
    this.http.post<{message: string, post: Post}>(this.BACKEND_URL,
  postData)
    .subscribe((responseData) => {
      this.router.navigate(['/']);
    });

  }

  deletePost(postId: string) {
    return this.http.delete(this.BACKEND_URL + '/' + postId);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post|FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image,
        creator: null
      };
    }
    this.http.put(this.BACKEND_URL + '/' + id, postData)
    .subscribe(response => {
      this.router.navigate(['/']);
    });
  }
}
