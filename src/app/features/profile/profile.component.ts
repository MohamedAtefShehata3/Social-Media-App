import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MyPostsComponent } from '../my-posts/my-posts.component';
import { ProfileService } from './service/profile.service';

export interface UserProfile {
  _id: string;
  name: string;
  username: string;
  email: string;
  photo: string;
  cover: string;
  followers: string[];
  following: string[];
  bookmarks: any[];
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, MyPostsComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, OnDestroy {
  private profileService = inject(ProfileService);
  private activatedRoute = inject(ActivatedRoute);
  private subscriptions: Subscription[] = [];

  userData: UserProfile | null = null;
  //postList: any[] = [];
  savedList: any[] = [];
  postsCount = 0;
  activeTab: 'posts' | 'saved' = 'posts';
  isLoading = true;
  currentUserId: string | null = null;
  loggedInUserId: string | null = null;
  hasError = false;

  get isOwnProfile(): boolean {
    return !!this.currentUserId && this.currentUserId === this.loggedInUserId;
  }

  ngOnInit(): void {
    this.loggedInUserId = this.readLoggedInUserId();
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private readLoggedInUserId(): string | null {
    try {
      const saved = localStorage.getItem('socialUser');
      return saved ? (JSON.parse(saved)._id ?? null) : null;
    } catch {
      return null;
    }
  }

  loadUserProfile(): void {
    const routeSub = this.activatedRoute.paramMap.subscribe((params) => {
      this.currentUserId = params.get('id') ?? this.loggedInUserId;
      this.activeTab = 'posts';
      this.hasError = false;
      this.postsCount = 0;
      this.savedList = [];

      if (!this.currentUserId) {
        this.hasError = true;
        this.isLoading = false;
        return;
      }
      this.isLoading = true;
      this.getProfileData(this.currentUserId);
      //this.getUserPosts(this.currentUserId);
    });
    this.subscriptions.push(routeSub);
  }

  getProfileData(userId: string): void {
    this.subscriptions.push(
      this.profileService.getUserProfile(userId).subscribe({
        next: (res) => {
          const user = res.data?.user || res.data || res.user || res || {};
          this.userData = {
            ...user,
            followersCount: user.followers?.length ?? 0,
            followingCount: user.following?.length ?? 0,
            bookmarksCount: user.bookmarks?.length ?? 0,
          };
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching profile data: ', err);
          this.hasError = true;
          this.isLoading = false;
        },
      }),
    );
  }

  // getUserPosts(userId: string): void {
  //   this.subscriptions.push(
  //     this.profileService.getUserPosts(userId).subscribe({
  //       next: (res) => {
  //         const all: any[] = res.data?.posts ?? res.posts ?? (Array.isArray(res) ? res : []);
  //         this.postList = all.filter(
  //           (p) => p.body?.toString().trim() || p.image?.toString().trim(),
  //         );
  //         this.isLoading = false;
  //       },
  //       error: (err) => {
  //         console.error('Error loading posts: ', err);
  //         this.isLoading = false;
  //       },
  //     }),
  //   );
  // }

  setTab(tab: 'posts' | 'saved'): void {
    this.activeTab = tab;
    if (tab === 'saved' && this.isOwnProfile && !this.savedList.length) {
      this.subscriptions.push(
        this.profileService.getBookmarks().subscribe({
          next: (res) => (this.savedList = res.data?.bookmarks ?? res.bookmarks ?? []),
          error: (err) => console.error('Error loading bookmarks: ', err),
        }),
      );
    }
  }

  // get visiblePosts(): any[] {
  //   return this.activeTab === 'posts' ? this.postList : this.savedList;
  // }

  onFileSelected(event: Event, type: 'photo' | 'cover'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.userData) return;

    const previous = this.userData[type];
    const reader = new FileReader();
    reader.onload = () => this.userData && (this.userData[type] = reader.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append(type, file);

    const request$ =
      type === 'photo'
        ? this.profileService.uploadProfileImage(formData)
        : this.profileService.uploadCoverImage(formData);

    this.subscriptions.push(
      request$.subscribe({
        next: () => this.currentUserId && this.getProfileData(this.currentUserId),
        error: () => this.userData && (this.userData[type] = previous),
      }),
    );
    input.value = '';
  }

  get stats() {
    return [
      { label: 'Followers', value: this.userData?.followersCount ?? 0 },
      { label: 'Following', value: this.userData?.followingCount ?? 0 },
      { label: 'Bookmarks', value: this.userData?.bookmarksCount ?? 0 },
    ];
  }
}
