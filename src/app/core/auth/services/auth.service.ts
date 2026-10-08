import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  signUp(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + '/users/signup', data);
  }

  signIn(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + '/users/signin', data);
  }

  getFollowSuggestions(limit: number): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/users/suggestions?limit=${limit}`);
  }

  changePassword(formData: object): Observable<any> {
    return this.httpClient.patch(environment.baseUrl + `/users/change-password`, formData);
  }

  signOut(): void {
    localStorage.removeItem('socialToken');
    this.router.navigate(['/login']);
  }

  forgotPassword(email: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + '/users/forgot-password', { email });
  }

  verifyResetCode(data: { email: string; code: string }): Observable<any> {
    return this.httpClient.post(environment.baseUrl + '/users/verify-reset-code', data);
  }

  resetPassword(data: { email: string; code: string; newPassword: string }): Observable<any> {
    return this.httpClient.post(environment.baseUrl + '/users/reset-password', data);
  }

  followUser(userId: string): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `/users/${userId}/follow`, {});
  }
}
