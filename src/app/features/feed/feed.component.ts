import { Component, OnInit } from '@angular/core';
import { LeftSideComponent } from './left-side/left-side.component';
import { FeedContentComponent } from './feed-content/feed-content.component';
import { RightSideComponent } from './right-side/right-side.component';
import { ThemeService } from '../../core/auth/services/theme.service';

@Component({
  selector: 'app-feed',
  imports: [LeftSideComponent, FeedContentComponent, RightSideComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent implements OnInit {
  isDarkMode = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.currentTheme$.subscribe((theme) => {
      this.isDarkMode = theme === 'dark';
    });
  }
}
