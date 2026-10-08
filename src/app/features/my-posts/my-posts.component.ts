import {
  Component,
  DestroyRef,
  inject,
  OnChanges,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TimeAgoPipe } from '../../shared/pipes/time-ago-pipe';
import { ProfileService } from '../profile/service/profile.service';
import { PostsService } from '../../core/services/post.service';
import { Post } from '../../core/models/post.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-my-posts',
  imports: [RouterLink, TimeAgoPipe],
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.css',
})
export class MyPostsComponent implements OnChanges {
  private readonly profileService = inject(ProfileService);
  private readonly postsService = inject(PostsService);
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true }) userId!: string;
  @Input() isOwner = false;
  @Output() countChange = new EventEmitter<number>();

  posts: Post[] = [];
  isLoading = true;
  hasError = false;
  confirmDeleteId: string | null = null;

  private readonly loggedInUserId: string | null = this.readLoggedInUserId();

  ngOnChanges(): void {
    if (this.userId) this.loadPosts();
  }

  loadPosts(): void {
    this.isLoading = true;
    this.hasError = false;

    this.profileService
      .getUserPosts(this.userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const all: Post[] = res.data?.posts ?? res.posts ?? (Array.isArray(res) ? res : []);
          this.posts = all
            .filter((p) => p.body?.toString().trim() || p.image?.toString().trim() || p.sharedPost)
            .map((p) => ({
              ...p,
              isLiked: p.likes?.some((l: any) => (l._id || l) === this.loggedInUserId) ?? false,
            }));
          this.countChange.emit(this.posts.length);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading posts: ', err);
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

  askDelete(id: string): void {
    this.confirmDeleteId = id;
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
  }

  confirmDelete(): void {
    const id = this.confirmDeleteId;
    if (!id) return;

    this.postsService
      .deletePost(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.posts = this.posts.filter((p) => p._id !== id);
          this.countChange.emit(this.posts.length);
          this.confirmDeleteId = null;
        },
        error: (err) => {
          console.error('Error deleting post: ', err);
          this.confirmDeleteId = null;
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
