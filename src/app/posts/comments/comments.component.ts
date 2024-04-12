import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Comments } from 'src/app/interfaces/comments.interface';
import { Posts } from 'src/app/interfaces/posts.interface';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  comments$: Observable<Comments[]> | null = null;
  postTitle: string = '';
  postBody: string = '';
  lastNumberFromUrl: number | null = null;
  postId: number | null = null;
  addForm: FormGroup;
  isEditing: boolean = false;
  editedPostTitle: string = '';
  editedPostBody: string = '';
  editMode!: boolean;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
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
    if (this.lastNumberFromUrl !== null) {
      this.http.get<Posts>(`https://jsonplaceholder.typicode.com/posts/${this.lastNumberFromUrl}`)
        .subscribe((post) => {
          this.postTitle = post.title;
          this.postBody = post.body;
          this.editedPostTitle = post.title; 
          this.editedPostBody = post.body;
        }, (error) => {
          console.error('Error loading post:', error);
        });
    }
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
    if (!this.editMode) {
      this.postTitle = this.editedPostTitle;
      this.postBody = this.editedPostBody;
    }
  }

  savePost(): void {
    this.editedPostTitle = this.postTitle;
    this.editedPostBody = this.postBody;
    this.toggleEditMode();
  }
}
