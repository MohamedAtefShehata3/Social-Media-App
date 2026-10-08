import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);

  getAllPosts(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/posts`);
  }

  createPosts(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/posts`, data);
  }

  updatePost(postId: string, data: object): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `/posts/${postId}`, data);
  }

  sharePost(postId: string, data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/posts/${postId}/share`, data);
  }

  getSinglePost(postId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/posts/${postId}`);
  }

  changeLike(postId: string): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `/posts/${postId}/like`, {});
  }

  deletePost(postId: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `/posts/${postId}`);
  }

  toggleBookmark(postId: string): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `/posts/${postId}/bookmark`, {});
  }
}
