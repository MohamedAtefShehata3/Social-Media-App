import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';

interface Suggestion {
  _id: string;
  name: string;
  username: string;
  photo: string;
  followersCount: number;
  isFollowing: boolean;
}

@Component({
  selector: 'app-right-side',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './right-side.component.html',
})
export class RightSideComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  suggestions: Suggestion[] = [];
  search = '';
  limit = 5;
  isLoading = true;
  hasError = false;
  canLoadMore = true;
  private pending = new Set<string>();

  get filtered(): Suggestion[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.suggestions;
    return this.suggestions.filter(
      (s) => s.name.toLowerCase().includes(q) || s.username.toLowerCase().includes(q),
    );
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.hasError = false;

    this.authService
      .getFollowSuggestions(this.limit)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const list: any[] = res.data?.suggestions ?? res.suggestions ?? res.data ?? [];
          const followed = new Set(this.suggestions.filter((s) => s.isFollowing).map((s) => s._id));

          this.suggestions = list.map((u) => ({
            _id: u._id,
            name: u.name ?? '',
            username: u.username ?? '',
            photo: u.photo ?? '',
            followersCount: u.followersCount ?? u.followers?.length ?? 0,
            isFollowing: followed.has(u._id),
          }));
          this.canLoadMore = list.length >= this.limit;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading suggestions: ', err);
          this.hasError = true;
          this.isLoading = false;
        },
      });
  }

  viewMore(): void {
    this.limit += 5;
    this.load();
  }

  isPending(id: string): boolean {
    return this.pending.has(id);
  }

  follow(user: Suggestion): void {
    if (this.pending.has(user._id)) return;
    this.pending.add(user._id);

    // تحديث فوري، ويرجع لو الطلب فشل
    const wasFollowing = user.isFollowing;
    user.isFollowing = !wasFollowing;
    user.followersCount += wasFollowing ? -1 : 1;

    this.authService
      .followUser(user._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.pending.delete(user._id),
        error: (err) => {
          console.error('Error following user: ', err);
          user.isFollowing = wasFollowing;
          user.followersCount += wasFollowing ? 1 : -1;
          this.pending.delete(user._id);
        },
      });
  }
}
