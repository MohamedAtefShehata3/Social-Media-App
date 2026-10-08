import { Component, inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommentsComponent } from './components/comments/comments.component';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago-pipe';
import { PostsService } from '../../../core/services/post.service';
import { Post } from '../../../core/models/post.interface';

@Component({
  selector: 'app-feed-content',
  imports: [ReactiveFormsModule, CommentsComponent, TimeAgoPipe],
  templateUrl: './feed-content.component.html',
  styleUrl: './feed-content.component.css',
})
export class FeedContentComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  currentUser = JSON.parse(localStorage.getItem('socialUser')!);

  content: FormControl = new FormControl('');
  shareContent: FormControl = new FormControl('');
  privacy: FormControl = new FormControl('public');
  postList: Post[] = [];
  saveFile: File | null = null;
  imgUrl: string | ArrayBuffer | null | undefined;
  isEditMode: boolean = false;
  editPostId: string = '';

  ngOnInit(): void {
    this.getAllPostData();
  }

  confirmShare(e: Event): void {
    e.preventDefault();
    if (!this.selectedPostForShare) return;

    const shareData = {
      body: this.shareContent.value || ' ',
    };

    const postId = this.selectedPostForShare._id;

    this.postsService.sharePost(postId, shareData).subscribe({
      next: (res) => {
        console.log('Success', res);
        this.shareContent.reset();
        this.closeShareModal();
        this.getAllPostData();
      },
      error: (err) => {
        console.error('Error!', err);
      },
    });
  }

  @ViewChildren(CommentsComponent) commentComponent!: QueryList<CommentsComponent>;

  toggleComments(postId: string) {
    const targetComponent = this.commentComponent.find((comp) => comp.postId === postId);

    if (targetComponent) {
      targetComponent.showAllComments = !targetComponent.showAllComments;
      targetComponent.isSectionVisible = !targetComponent.isSectionVisible;
    }
  }

  getAllPostData(): void {
    this.postsService.getAllPosts().subscribe({
      next: (res) => {
        this.postList = res.data.posts.map((post: any) => {
          return {
            ...post,
            isLiked: post.likes
              ? post.likes.some((u: any) => {
                  const likedUserId = u._id || u;
                  return likedUserId === this.currentUser?._id;
                })
              : false,
            likesCount: post.likesCount || (post.likes ? post.likes.length : 0),
          };
        });
      },
      error: (err) => console.error('getAllPosts failed', err),
    });
  }

  // changeImg(e: Event): void {
  //   const input = e.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     this.saveFile = input.files[0];

  //     const fileReader = new FileReader();
  //     fileReader.readAsDataURL(this.saveFile);
  //     fileReader.onload = (e) => {
  //       if (e.target?.result) {
  //         this.imgUrl = e.target?.result;
  //       }
  //     };
  //     input.value = '';
  //   }
  // }

  async changeImg(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const original = input.files?.[0];
    if (!original) return;
    input.value = '';

    this.saveFile = await this.compressImage(original);

    const reader = new FileReader();
    reader.onload = () => (this.imgUrl = reader.result);
    reader.readAsDataURL(this.saveFile);
  }

  removeImg(): void {
    this.imgUrl = '';
    this.saveFile = null;
  }

  isPosting = false;

  submitForm(e: Event): void {
    e.preventDefault();
    console.log('submitForm called', this.content.value, this.saveFile);

    const body = this.content.value?.trim();
    if (!body && !this.saveFile) return; // مفيش نص ولا صورة
    if (this.isPosting) return;

    const formData = new FormData();
    if (body) formData.append('body', body);
    if (this.privacy.value) formData.append('privacy', this.privacy.value);
    if (this.saveFile) formData.append('image', this.saveFile);

    this.isPosting = true;
    this.postsService.createPosts(formData).subscribe({
      next: (res) => {
        console.log('createPost response', res);
        this.isPosting = false;
        this.getAllPostData();
        this.resetForm();
      },
      error: (err) => {
        this.isPosting = false;
        console.error('createPost failed', err);
      },
    });
  }

  resetForm(): void {
    this.content.reset();
    this.privacy.setValue('public');
    this.imgUrl = '';
    this.saveFile = null;

    this.isEditMode = false;
    this.editPostId = '';
  }

  deletePostItem(postId: string): void {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.getAllPostData();
        }
      },
    });
  }

  EditPost(post: any): void {
    this.isEditMode = true;
    this.editPostId = post._id;

    this.content.setValue(post.body);
    this.privacy.setValue(post.privacy);

    if (post.image) {
      this.imgUrl = post.image;
    } else {
      this.imgUrl = '';
    }

    this.saveFile = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updatePrivacy(postId: string, event: any): void {
    const newPrivacy = event.target.value;

    const formData = new FormData();
    formData.append('privacy', newPrivacy);

    this.postsService.updatePost(postId, formData).subscribe({
      next: (res) => {
        const postIndex = this.postList.findIndex((p) => p._id === postId);
        if (postIndex !== -1) {
          this.postList[postIndex].privacy = newPrivacy;
        }
      },
    });
  }

  updatePost(e: Event): void {
    e.preventDefault();
    if (!this.editPostId || this.isPosting) return;
    this.isPosting = true;

    const formData = new FormData();
    if (this.content.value) formData.append('body', this.content.value);
    if (this.privacy.value) formData.append('privacy', this.privacy.value);
    if (this.saveFile) formData.append('image', this.saveFile);

    this.postsService.updatePost(this.editPostId, formData).subscribe({
      next: () => {
        this.isPosting = false;
        this.getAllPostData();
        this.resetForm();
      },
      error: (err) => {
        this.isPosting = false;
        console.error('updatePost failed', err);
      },
    });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  selectedPostForShare: any = '';
  isShareModalOpen: boolean = false;

  openShareModal(post: any): void {
    this.selectedPostForShare = post;
    this.isShareModalOpen = true;
  }

  closeShareModal(): void {
    this.isShareModalOpen = false;
    this.selectedPostForShare = null;
  }

  onLikeClick(post: any) {
    this.postsService.changeLike(post._id).subscribe({
      next: (res) => {
        console.log('Response:', res);

        if (res.message === 'success') {
          post.isLiked = !post.isLiked;

          if (post.isLiked) {
            post.likesCount++;
          } else {
            post.likesCount--;
          }
        }
      },
    });
  }

  activeMenuId: string | null = null;

  toggleMenu(id: string): void {
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  private compressImage(file: File, maxSize = 1600, quality = 0.8): Promise<File> {
    // الـ GIF بيتسيب زي ما هو عشان ما يفقدش الحركة
    if (!file.type.startsWith('image/') || file.type === 'image/gif') return Promise.resolve(file);

    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) return resolve(file);
            const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
            resolve(new File([blob], name, { type: 'image/jpeg' }));
          },
          'image/jpeg',
          quality,
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(file);
      };
      img.src = url;
    });
  }
}
