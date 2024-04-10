import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user.interface';
import {Posts} from '../interfaces/posts.interface'
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';




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
  newUserName: any;
  dataReady = false;

  constructor(private apiService: ApiService, private fb: FormBuilder, private router: Router) { }
 

  ngOnInit(): void {
    this.addForm = this.fb.group({
      author: ['', Validators.required],
      title: ['', Validators.required],
      body: ['', Validators.required]
    });


    this.apiService.getUsers().subscribe((users: User[]) => {
      setTimeout(() => {
        for (const user of users) {
          this.usersMap[user.id] = user.name;
        }
      });
    });

    this.apiService.getPosts().subscribe((posts: Posts[]) => {
      setTimeout(() => {
        this.posts = posts.map(post => {
          return {
            ...post,
            userName: this.usersMap[post.userId]
          };
        });
      });
    });
  }

  navigateToPost(postId: number): void {
    this.router.navigate(['/posts', postId]);
  }

  addPost() {
    if (this.addForm.valid) {
      let newUserId = 1; // Default value for new user id
      let newId = 1; // Default value for new post id
      
      if (this.posts.length > 0) {
        newUserId = this.getLastUserId() + 1; // Increment the last user id
        newId = this.posts[this.posts.length - 1].id + 1; // Increment the last post id
      }
      
      const newPost = {
        userId: newUserId,
        id: newId,
        title: this.newTitle,
        body: this.newBody,
        userName: this.newAuthor
      };
  
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
    console.log()
  }

}