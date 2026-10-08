import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly httpClient = inject(HttpClient);

  getNotifications(unread: boolean = false): Observable<any> {
    return this.httpClient.get(
      environment.baseUrl + `/notifications?unread=${unread}&page=1&limit=10`,
    );
  }

  markAsRead(id: string): Observable<any> {
    return this.httpClient.patch(environment.baseUrl + `/notifications/${id}/read`, {});
  }

  markAllAsRead(): Observable<any> {
    return this.httpClient.patch(environment.baseUrl + `/notifications/read-all`, {});
  }
}
