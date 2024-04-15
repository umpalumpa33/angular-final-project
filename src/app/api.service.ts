import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../app/interfaces/user.interface';
import { Posts } from '../app/interfaces/posts.interface'
import { Albums } from './interfaces/albums.interface';
import { Photos } from './interfaces/photos.interface';
import { Todos } from './interfaces/todos.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`)
    .pipe(catchError(handleFunction));
  }

  getPosts(): Observable<Posts[]> {
    return this.http.get<Posts[]>(`${this.apiUrl}/posts`).pipe(catchError(handleFunction));
  }

  getAlbums(): Observable<Albums[]>{
    return this.http.get<Albums[]>(`${this.apiUrl}/albums`)
  }

  getPhotosCount(albumId: number): Observable<Photos[]> {
    return this.http.get<Photos[]>(`${this.apiUrl}/albums/${albumId}/photos`)
      .pipe(catchError(handleFunction));
  }

  getPhotos(albumId: number): Observable<Photos[]> {
    return this.http.get<Photos[]>(`${this.apiUrl}/albums/${albumId}/photos`);
  }

  getTodos(): Observable<Todos[]>{
    return this.http.get<Todos[]>(`${this.apiUrl}/todos`)
  }

  getCommentsForPost(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/posts/${postId}/comments`);
  }


}

function handleFunction(error: HttpErrorResponse) {
  console.log(error);
  return throwError(`error happened: ${error.error}`)
}
