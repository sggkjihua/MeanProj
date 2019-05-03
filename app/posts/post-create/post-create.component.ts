import { Component, OnInit } from '@angular/core';
import { Post } from '../Post.model';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredContent = '';
  enteredTitle = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postId: string;
  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null,
      {
        validators: [Validators.required, Validators.minLength(4)]}),
      image: new FormControl(null, {
        validators: [Validators.required], asyncValidators: mimeType})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.post = {id: postData._id, title: postData.title, content: postData.content};
          this.isLoading = false;
          this.form.setValue({
            title: this.post.title,
            content: this.post.content});
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    const post: Post = {
      id: null,
      title: this.form.value.title,
      content: this.form.value.content
    };
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content);
    }
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    // console.log(this.form);
    // console.log(this.form.get('image'));
  }

  constructor(public postsService: PostService, public route: ActivatedRoute) {}
  /*
  onAddPost(postInput:HTMLTextAreaElement){
    this.newPost = postInput.value;
    console.log(postInput);
  }
  */
    /* used to pop up the alert */
    /*alert("Post added!");*/
}
