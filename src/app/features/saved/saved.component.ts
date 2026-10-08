import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Post } from '../../core/models/post.interface';
import { PostsService } from '../../core/services/post.service';
import { TimeAgoPipe } from '../../shared/pipes/time-ago-pipe';
import { ProfileService } from '../profile/service/profile.service';

@Component({
  selector: 'app-saved',
  standalone: true,
  imports: [RouterLink, TimeAgoPipe],
  templateUrl: './saved.component.html',
})
export class SavedComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly postsService = inject(PostsService);
  private readonly destroyRef = inject(DestroyRef);

  posts: Post[] = [];
  isLoading = true;
  hasError = false;

  private readonly loggedInUserId: string | null = this.readLoggedInUserId();

  ngOnInit(): void {
    this.loadSaved();
  }

  loadSaved(): void {
    this.isLoading = true;
    this.hasError = false;

    this.profileService
      .getBookmarks()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const all: Post[] = res.data?.bookmarks ?? res.bookmarks ?? res.data?.posts ?? [];
          this.posts = all.map((p) => ({
            ...p,
            bookmarked: true,
            isLiked: p.likes?.some((l: any) => (l._id || l) === this.loggedInUserId) ?? false,
          }));
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading saved posts: ', err);
          this.hasError = true;
          this.isLoading = false;
        },
      });
  }

  onLike(post: Post): void {
    // تحديث فوري، ويرجع لو الطلب فشل
    const wasLiked = post.isLiked;
    post.isLiked = !wasLiked;
    post.likesCount += wasLiked ? -1 : 1;

    this.postsService
      .changeLike(post._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => {
          post.isLiked = wasLiked;
          post.likesCount += wasLiked ? 1 : -1;
        },
      });
  }

  unsave(post: Post): void {
    // يتشال من الليستة فوراً، ويرجع مكانه لو الطلب فشل
    const index = this.posts.findIndex((p) => p._id === post._id);
    if (index === -1) return;
    this.posts = this.posts.filter((p) => p._id !== post._id);

    this.postsService
      .toggleBookmark(post._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err) => {
          console.error('Error removing bookmark: ', err);
          const restored = [...this.posts];
          restored.splice(index, 0, post);
          this.posts = restored;
        },
      });
  }

  privacyIcon(privacy: string): string {
    return privacy === 'private'
      ? 'fa-lock'
      : privacy === 'friends'
        ? 'fa-user-group'
        : 'fa-earth-americas';
  }

  private readLoggedInUserId(): string | null {
    try {
      const saved = localStorage.getItem('socialUser');
      return saved ? (JSON.parse(saved)._id ?? null) : null;
    } catch {
      return null;
    }
  }
}
