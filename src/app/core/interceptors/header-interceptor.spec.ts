import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpInterceptorFn } from '@angular/common/http';

import { headerInterceptor } from './header-interceptor';

describe('headerInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => headerInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule, RouterTestingModule] });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});