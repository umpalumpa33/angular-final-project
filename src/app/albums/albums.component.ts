import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.interface';
import { Albums } from '../interfaces/albums.interface';
import { Photos } from '../interfaces/photos.interface';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent implements OnInit {
  usersMap: { [key: number]: string } = {};
  albums: Albums[] = [];
  photosCountMap: { [key: number]: number } = {}; // Map to store photo counts for each album

  constructor(private apiService: ApiService, private fb: FormBuilder, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.apiService.getAlbums().subscribe((albums: Albums[]) => {
      this.albums = albums;
      this.loadUsers();
      this.loadPhotosCount();
    });
  }

  loadUsers(): void {
    this.apiService.getUsers().subscribe((users: User[]) => {
      this.usersMap = users.reduce((acc: { [key: number]: string }, user) => {
        acc[user.id] = user.name;
        return acc;
      }, {});
    });
  }

  loadPhotosCount(): void {
    this.albums.forEach((album) => {
      this.apiService.getPhotosCount(album.id).subscribe((photos: Photos[]) => {
        this.photosCountMap[album.id] = photos.length; // Store the number of photos for the album
      });
    });
  }

  navigateToPhotos(album: Albums): void {
    this.router.navigate(['/albums', album.id]);
  }
}
