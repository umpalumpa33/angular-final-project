import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { Posts } from '../interfaces/posts.interface'
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';




@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  posts: Posts[] = [];
  showForm = false;
  addForm!: FormGroup;
  comments$: Observable<Comment[]> | undefined;
  usersMap: { [key: number]: string } = {};
  newAuthor!: string;
  newBody!: string;
  newTitle!: string;
  newUserName: any;
  dataReady = false;

  constructor(private apiService: ApiService, private fb: FormBuilder, private router: Router, private http: HttpClient) { }
 

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


  navigateToPost(post: Posts): void {
    this.router.navigate(['/posts', post.id]);
  }
  addPost() {
    if (this.addForm.valid) {
      let newUserId = 1; 
      let newId = 1; 
      
      if (this.posts.length > 0) {
        newUserId = this.getLastUserId() + 1; 
        newId = this.posts[this.posts.length - 1].id + 1; 
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