import { Component } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  newPost="";
  enteredValue = "";
  onAddPost(){
    this.newPost = this.enteredValue;
  }
  /*
  onAddPost(postInput:HTMLTextAreaElement){
    this.newPost = postInput.value;
    console.log(postInput);
  }
  */
    /* used to pop up the alert */
    /*alert("Post added!");*/
}
