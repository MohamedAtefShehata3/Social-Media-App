import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FeedContentComponent } from './feed-content.component';

describe('FeedContentComponent', () => {
  let component: FeedContentComponent;
  let fixture: ComponentFixture<FeedContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedContentComponent, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
