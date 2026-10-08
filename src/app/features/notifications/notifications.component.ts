import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from './service/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {
  private notificationsService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  notifications: any[] = [];
  filter: 'all' | 'unread' = 'all';
  isLoading = false;
  hasError = false;

  get unreadCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.hasError = false;

    this.notificationsService
      .getNotifications(this.filter === 'unread')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.notifications = res.data?.notifications ?? res.notifications ?? [];
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading notifications: ', err);
          this.hasError = true;
          this.isLoading = false;
        },
      });
  }

  changeFilter(type: 'all' | 'unread'): void {
    if (this.filter === type) return;
    this.filter = type;
    this.loadNotifications();
  }

  markAsRead(n: any): void {
    if (n.isRead) return;
    n.isRead = true; // تحديث فوري، ويرجع لو الطلب فشل
    this.notificationsService
      .markAsRead(n._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: () => (n.isRead = false) });
  }

  markAllAsRead(): void {
    if (!this.unreadCount) return;
    this.notificationsService
      .markAllAsRead()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notifications.forEach((n) => (n.isRead = true));
          if (this.filter === 'unread') this.notifications = [];
        },
        error: (err) => console.error('Error marking all as read: ', err),
      });
  }

  getMessage(n: any): string {
    const messages: Record<string, string> = {
      like: 'liked your post',
      comment: 'commented on your post',
      share: 'shared your post',
      follow: 'started following you',
    };
    return messages[n.type] ?? n.message ?? 'sent you a notification';
  }
}
