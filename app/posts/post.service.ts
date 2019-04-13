import { Post } from './Post.model';
import { Subject } from 'rxjs';

export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  getPosts() {
    return [...this.posts];
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(titleAdd: string, contentAdd: string) {
    const post: Post = {title: titleAdd, content: contentAdd};
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
