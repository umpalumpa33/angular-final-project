import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PostsComponent } from './posts/posts.component';
import { AlbumsComponent } from './albums/albums.component';
import { TodosComponent } from './todos/todos.component';
import { MainPageComponent } from './main-page/main-page.component';
import { CommentsComponent } from './posts/comments/comments.component';
import { PhotosComponent } from './albums/photos/photos.component';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/main-page',
    pathMatch: 'full', 
  },
  {
    path: 'main-page',
    component: MainPageComponent
  },
  {
    path: 'posts',
    component: PostsComponent
  },
  { path: 'posts/:postId',
   component: CommentsComponent },
  {
    path: 'albums',
    component: AlbumsComponent
  },
  {
    path: 'albums/:albumsId',
    component: PhotosComponent
  },
  {
    path: 'todos',
    component: TodosComponent
  },

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
