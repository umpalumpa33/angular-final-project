import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { Comments } from 'src/app/interfaces/comments.interface';
import { Posts } from 'src/app/interfaces/posts.interface';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  comments$: Observable<Comments[]> | null = null;
  posts$!: Observable<Posts[]> 
  postTitle: string = '';
  postBody: string = '';
  lastNumberFromUrl!: number 
  addForm: FormGroup;
  isEditing: boolean = false;
  editedPostTitle: string = '';
  editedPostBody: string = '';
  editMode!: boolean;
  @Input() postId: number = 0;
  @Input() postTitle1: string = '';
  @Output() postUpdated: EventEmitter<Posts> = new EventEmitter<Posts>();
  

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private apiService: ApiService,
  ) {
    this.addForm = this.fb.group({
      commentName: ['', Validators.required],
      commentBody: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const currentUrl = window.location.href;
    const matches = currentUrl.match(/\d+$/);
    if (matches) {
      this.lastNumberFromUrl = parseInt(matches[0], 10);
      this.postId = this.lastNumberFromUrl;
      this.loadComments();
      this.loadPostTitleAndBody();
    }
  }

  loadComments(): void {
    if (this.lastNumberFromUrl !== null) {
      this.comments$ = this.http.get<Comments[]>(`https://jsonplaceholder.typicode.com/posts/${this.lastNumberFromUrl}/comments`)
        .pipe(
          catchError(error => {
            console.error('Error loading comments:', error);
            return of([]);
          })
        );
    }
  }

  loadPostTitleAndBody(): void {
      this.http.get<Posts>(`https://jsonplaceholder.typicode.com/posts/${this.lastNumberFromUrl}`)
        .subscribe((post) => {
          this.postTitle = post.title;
          this.postBody = post.body;
        }, (error) => {
          console.error('Error loading post:', error);
        });
  }

  addComment(): void {
    if (this.addForm.valid) {
      const newCommentId = 1;
      const newComment: Comments = {
        postId: this.postId,
        id: newCommentId,
        name: this.addForm.get('commentName')?.value,
        body: this.addForm.get('commentBody')?.value
      };

      if (this.comments$) {
        this.comments$ = this.comments$.pipe(
          tap(comments => comments.unshift(newComment))
        );
      }

      this.addForm.reset();
    } else {
      console.log('Form is invalid');
    }
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }


  gettingUserId(): number {
    if(Math.round(this.lastNumberFromUrl / 10) == 0 || this.lastNumberFromUrl == 10){
      return 1
    } else if(Math.round(this.lastNumberFromUrl / 10) == 1 || this.lastNumberFromUrl == 20){
      return 2
    } else if(Math.round(this.lastNumberFromUrl / 10) == 2 || this.lastNumberFromUrl == 30){
      return 3
    } else if(Math.round(this.lastNumberFromUrl / 10) == 3 || this.lastNumberFromUrl == 40){
      return 4
    } else if(Math.round(this.lastNumberFromUrl / 10) == 4 || this.lastNumberFromUrl == 50){
      return 5
    } else if(Math.round(this.lastNumberFromUrl / 10) == 5 || this.lastNumberFromUrl == 60){
      return 6
    } else if(Math.round(this.lastNumberFromUrl / 10) == 6 || this.lastNumberFromUrl == 70){
      return 7
    } else if(Math.round(this.lastNumberFromUrl / 10) == 7 || this.lastNumberFromUrl == 80){
      return 8
    } else if(Math.round(this.lastNumberFromUrl / 10) == 8 || this.lastNumberFromUrl == 90){
      return 9
    } else if(Math.round(this.lastNumberFromUrl / 10) == 9 || this.lastNumberFromUrl == 100){
      return 10
    } else {
      throw new Error('Error');
    }
  }

  gettingUserName(): string {
    if(Math.round(this.lastNumberFromUrl / 10) == 0 || this.lastNumberFromUrl == 10){
      return "Leanne Graham"
    } else if(Math.round(this.lastNumberFromUrl / 10) == 1 || this.lastNumberFromUrl == 20){
      return "Ervin Howell"
    } else if(Math.round(this.lastNumberFromUrl / 10) == 2 || this.lastNumberFromUrl == 30){
      return "Clementine Bauch"
    } else if(Math.round(this.lastNumberFromUrl / 10) == 3 || this.lastNumberFromUrl == 40){
      return "Patricia Lebsack"
    } else if(Math.round(this.lastNumberFromUrl / 10) == 4 || this.lastNumberFromUrl == 50){
      return "Chelsey Dietrich"
    } else if(Math.round(this.lastNumberFromUrl / 10) == 5 || this.lastNumberFromUrl == 60){
      return "Mrs. Dennis Schulist"
    } else if(Math.round(this.lastNumberFromUrl / 10) == 6 || this.lastNumberFromUrl == 70){
      return "Kurtis Weissnat"
    } else if(Math.round(this.lastNumberFromUrl / 10) == 7 || this.lastNumberFromUrl == 80){
      return "Nicholas Runolfsdottir V"
    } else if(Math.round(this.lastNumberFromUrl / 10) == 8 || this.lastNumberFromUrl == 90){
      return "Glenna Reichert"
    } else if(Math.round(this.lastNumberFromUrl / 10) == 9 || this.lastNumberFromUrl == 100){
      return "Clementina DuBuque"
    } else {
      throw new Error('Error');
    }
  }
  
  savePost(): void {
    console.log(this.postTitle)
    const editedPost: Posts = {
      userId: this.gettingUserId(),
      id: this.lastNumberFromUrl,
      title: this.postTitle,
      body: this.postBody,
      userName: this.gettingUserName()
    };
    this.apiService.updatePost(editedPost);
    this.toggleEditMode();
  }
}
