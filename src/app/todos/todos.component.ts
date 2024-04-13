import { Component, OnInit } from '@angular/core';
import { Todos } from '../interfaces/todos.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';


@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {

  constructor(private http: HttpClient) { }

  todos$: Observable<Todos[]> | null = null;

  ngOnInit(): void {
    this.loadTodos()
  }

  loadTodos(): void {
    this.todos$ = this.http.get<Todos[]>(`https://jsonplaceholder.typicode.com/todos`)
        .pipe(
          catchError(error => {
            console.error('Error loading comments:', error);
            return of([]);
          })
        );
  }
}
