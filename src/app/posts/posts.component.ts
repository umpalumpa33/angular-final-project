import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { Posts } from '../interfaces/posts.interface';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

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

  toggleForm() {
    this.showForm = !this.showForm;
  }
}