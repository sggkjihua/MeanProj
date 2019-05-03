import { Post } from './Post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {

  }

  getPosts() {
    this.http.get<{message: string, posts: any[]}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
        };
      });
    }))
    .subscribe((transformedPosts) => {
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(postId: string) {
    return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + postId);
  }

  addPost(titleAdd: string, contentAdd: string, image: File) {
    const postData = new FormData();
    postData.append('title', titleAdd);
    postData.append('content', contentAdd);
    postData.append('image', image, titleAdd);
    // const post: Post = {id: null, title: titleAdd, content: contentAdd};
    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts',
  postData)
    .subscribe((responseData) => {
      // console.log(responseData.message);
      const post: Post = {
        id: responseData.post.id,
        title: titleAdd,
        content: contentAdd,
        imagePath: responseData.post.imagePath
      };
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });

  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
    .subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);

    });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content, imagePath: null };
    this.http.put('http://localhost:3000/api/posts/' + id, post)
    .subscribe(response => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }
}
