import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly httpClient = inject(HttpClient);

  getUserProfile(userId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/users/${userId}/profile`);
  }

  getUserPosts(userId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/users/${userId}/posts?limit=50`);
  }

  uploadProfileImage(formData: FormData): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `/users/upload-photo`, formData);
  }

  uploadCoverImage(data: FormData): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `/users/upload-cover`, data);
  }

  getBookmarks(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/users/bookmarks`);
  }
}
