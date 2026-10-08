import { Component, inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommentsComponent } from '../feed/feed-content/components/comments/comments.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TimeAgoPipe } from '../../shared/pipes/time-ago-pipe';
import { PostsService } from '../../core/services/post.service';
import { Post } from '../../core/models/post.interface';

@Component({
  selector: 'app-details',
  imports: [ReactiveFormsModule, CommentsComponent, RouterLink, TimeAgoPipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);
  private readonly router = inject(Router);

  postId: string = '';
  postDetails: Post | null = null;
  userId: string = JSON.parse(localStorage.getItem('socialUser')!)?._id;

  content = new FormControl('');
  privacy = new FormControl('public');
  shareContent = new FormControl('');

  isEditMode: boolean = false;
  editPostId: string = '';
  imgUrl: string | ArrayBuffer | null = '';
  saveFile: File | null = null;
  isShareModalOpen: boolean = false;
  selectedPostForShare: any = null;

  @ViewChildren(CommentsComponent) commentComponents!: QueryList<CommentsComponent>;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      this.postId = param.get('id')!;
      this.getPostDetails();
    });
  }

  getPostDetails(): void {
    this.postsService.getSinglePost(this.postId).subscribe({
      next: (res) => {
        this.postDetails = res.data.post;
        if (this.postDetails && this.postDetails.likes) {
          this.postDetails.isLiked = this.postDetails.likes.some(
            (like: any) => (like._id || like) === this.userId,
          );
        }
        setTimeout(() => this.openCommentsByDefault());
      },
    });
  }

  onLikeClick(post: any) {
    this.postsService.changeLike(post._id).subscribe({
      next: (res) => {
        if (res.message === 'success') {
          post.isLiked = !post.isLiked;
          post.isLiked ? post.likesCount++ : post.likesCount--;
        }
      },
    });
  }

  removeImg(): void {
    this.imgUrl = '';
    this.saveFile = undefined as any;
  }

  toggleComments(postId: string) {
    const targetComponent = this.commentComponents.find((comp) => comp.postId === postId);
    if (targetComponent) {
      targetComponent.showAllComments = !targetComponent.showAllComments;
      targetComponent.isSectionVisible = !targetComponent.isSectionVisible;
    }
  }

  deletePostItem(postId: string): void {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        if (res.success || res.message === 'success') {
          this.router.navigate(['/feed']);
        }
      },
    });
  }

  EditPost(postId: any): void {
    this.isEditMode = true;
    this.editPostId = postId._id;
    this.content.setValue(postId.body);
    this.privacy.setValue(postId.privacy);
    this.imgUrl = postId.image || '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updatePost(e: Event): void {
    e.preventDefault();
    if (!this.editPostId) return;

    const formData = new FormData();
    if (this.content.value) formData.append('body', this.content.value);
    if (this.privacy.value) formData.append('privacy', this.privacy.value);
    if (this.saveFile) formData.append('image', this.saveFile);

    this.postsService.updatePost(this.editPostId, formData).subscribe({
      next: (res) => {
        this.getPostDetails();
        this.resetForm();
      },
    });
  }

  confirmShare(e: Event): void {
    e.preventDefault();
    if (!this.selectedPostForShare) return;
    const shareData = { body: this.shareContent.value || '' };
    this.postsService.sharePost(this.selectedPostForShare._id, shareData).subscribe({
      next: (res) => {
        this.shareContent.reset();
        this.closeShareModal();
        this.getPostDetails();
      },
    });
  }

  openShareModal(post: any): void {
    this.selectedPostForShare = post;
    this.isShareModalOpen = true;
  }

  closeShareModal(): void {
    this.isShareModalOpen = false;
    this.selectedPostForShare = null;
  }

  resetForm(): void {
    this.content.reset();
    this.privacy.setValue('public');
    this.imgUrl = '';
    this.saveFile = null;
    this.isEditMode = false;
    this.editPostId = '';
  }

  changeImg(e: any): void {
    const file = e.target.files[0];
    if (file) {
      this.saveFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.imgUrl = reader.result);
      reader.readAsDataURL(file);
    }
  }

  openCommentsByDefault() {
    const targetComponent = this.commentComponents.find((comp) => comp.postId === this.postId);

    if (targetComponent) {
      targetComponent.isSectionVisible = true;
      targetComponent.showAllComments = true;
      targetComponent?.getComment();
    }
  }

  updatePrivacy(postId: string, event: any): void {
    const newPrivacy = event.target.value;

    const formData = new FormData();
    formData.append('privacy', newPrivacy);

    this.postsService.updatePost(postId, formData).subscribe({
      next: (res) => {
        if (this.postDetails) {
          this.postDetails.privacy = newPrivacy;
        }
      },
    });
  }
}
