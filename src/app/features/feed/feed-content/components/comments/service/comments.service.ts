import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../environment/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly httpClient = inject(HttpClient);

  getComment(postId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/posts/${postId}/comments?page=1&limit=10`);
  }

  createComment(postId: string, data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/posts/${postId}/comments`, data);
  }

  updatecomment(postId: string, commentId: string, content: string): Observable<any> {
    const formData = new FormData();
    formData.append('content', content);
    return this.httpClient.put(
      environment.baseUrl + `/posts/${postId}/comments/${commentId}`,
      formData,
    );
  }

  deleteComment(postId: string, commentId: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `/posts/${postId}/comments/${commentId}`);
  }

  getReplies(postId: string, commentId: string): Observable<any> {
    return this.httpClient.get(
      environment.baseUrl + `/posts/${postId}/comments/${commentId}/replies?page=1&limit=10`,
    );
  }

  createReply(postId: string, commentId: string, formData: FormData): Observable<any> {
    return this.httpClient.post(
      environment.baseUrl + `/posts/${postId}/comments/${commentId}/replies`,
      formData,
    );
  }

  toggleCommentLike(postId: string, commentId: string): Observable<any> {
    return this.httpClient.put(
      environment.baseUrl + `/posts/${postId}/comments/${commentId}/like`,
      {},
    );
  }
}
