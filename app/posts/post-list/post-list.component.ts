import { Component, Input } from '@angular/core';
import { Post } from '../Post.model';

@Component({
  templateUrl: './post-list.component.html',
  selector: 'app-post-list',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  @Input() posts: Post[] = [];
  // posts = [
  //   {title: 'first post', content: 'This is the first post'},
  //   {title: 'second post', content: 'This is the second post'}
  // ];
}
