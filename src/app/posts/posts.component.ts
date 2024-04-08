import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  posts: any[] = [];
  usersMap: { [key: number]: string } = {};
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/users')
      .subscribe(users => {
        this.usersMap = users.reduce((acc, user) => {
          acc[user.id] = user.name;
          return acc;
        }, {});
        this.fetchPosts();
      });
  }

 fetchPosts() {
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/posts')
      .subscribe(posts => {
        this.posts = posts.map(post => {
          return {
            ...post,
            userName: this.usersMap[post.userId] 
          };
        });
      });
  }


}