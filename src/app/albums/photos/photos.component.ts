import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { Photos } from 'src/app/interfaces/photos.interface';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit {

  constructor(private http: HttpClient,private apiService: ApiService) { }
  lastNumberFromUrl!: number;
  photos$: Observable<Photos[]> | null = null;

  ngOnInit(): void {
    const currentUrl = window.location.href;
    const matches = currentUrl.match(/\d+$/);
    if (matches) {
      this.lastNumberFromUrl = parseInt(matches[0], 10);
      this.loadPhotos();
    }
    this.photos$ = this.apiService.getPhotos(this.lastNumberFromUrl);
  }

  loadPhotos(): void {
    if (this.lastNumberFromUrl !== null) {
      this.photos$ = this.http.get<Photos[]>(`https://jsonplaceholder.typicode.com/albums/${this.lastNumberFromUrl}/photos`)
        .pipe(
          catchError(error => {
            console.error('Error loading comments:', error);
            return of([]);
          })
        );
    }
  }

}
