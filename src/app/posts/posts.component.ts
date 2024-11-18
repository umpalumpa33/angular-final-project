import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { Posts } from '../interfaces/posts.interface';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CommentsComponent } from './comments/comments.component';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  posts: Posts[] = [];
  showForm = false;
  addForm!: FormGroup;
  usersMap: { [key: number]: string } = {};
  newAuthor!: string;
  newBody!: string;
  newTitle!: string;
  dataReady = false;
  postId: number = 1;
  postTitle1: string = 'Initial Title';
  @ViewChild(CommentsComponent) commentsComponent!: CommentsComponent;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addForm = this.fb.group({
      author: ['', Validators.required],
      title: ['', Validators.required],
      body: ['', Validators.required]
    });

    this.apiService.updatedPost$.subscribe(updatedPost => {
      if (updatedPost) {
        // Find the index of the updated post in the posts array
        const index = this.posts.findIndex(post => post.id === updatedPost.id);
        if (index !== -1) {
          // Replace the existing post with the updated post
          this.posts[index] = updatedPost;
        } else {
          // Add the new post to the posts array if it doesn't exist
          this.posts.unshift(updatedPost);
        }
      }
    });

    forkJoin([
      this.apiService.getUsers(),
      this.apiService.getPosts()
    ]).subscribe(([users, posts]) => {
      for (const user of users) {
        this.usersMap[user.id] = user.name;
      }

      this.posts = posts.map(post => ({
        ...post,
        userName: this.usersMap[post.userId]
      }));

      this.dataReady = true;
    });
  }

  navigateToPost(post: Posts): void {
    this.router.navigate(['/posts', post.id]);
  }

  addPost() {
    if (this.addForm.valid) {
      const newUserId = this.posts.length > 0 ? this.getLastUserId() + 1 : 1;
      const newId = this.posts.length > 0 ? this.posts[this.posts.length - 1].id + 1 : 1;
      const newPost = { userId: newUserId, id: newId, title: this.newTitle, body: this.newBody, userName: this.newAuthor };
      this.posts.unshift(newPost);
      this.newTitle = '';
      this.newBody = '';
      this.newAuthor = '';
    } else {
      console.log('Form is invalid');
    }
  }

  getFormControl(name: string) {
    return this.addForm.get(name);
  }

  getLastUserId(): number {
    return this.posts[this.posts.length - 1].userId;
  }
  // onPostUpdated(event: { postTitle: string, postBody: string }): void {
  //   // Find the post in the posts array that matches the postId
  //   const postIndex = this.posts.findIndex(post => post.id === this.postId);
  //   if (postIndex !== -1) {
  //     // Update the title and body of the post
  //     this.posts[postIndex].title = event.postTitle;
  //     this.posts[postIndex].body = event.postBody;
  //   }
  // }

  // updatePost(updatedPost: Posts): void {
  //   // Find the index of the post with the matching ID
  //   const index = this.posts.findIndex(post => post.id === updatedPost.id);
  //   if (index !== -1) {
  //     // Update the post with the new data
  //     this.posts[index] = updatedPost;
  //   }
  // }

  toggleForm() {
    this.showForm = !this.showForm;
  }
}