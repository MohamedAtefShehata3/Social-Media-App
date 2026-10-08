import { CanActivateFn } from '@angular/router';
import { authGuard } from './auth-guard';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('authGuard', () => {
    const executeGuard: CanActivateFn = (...guardParameter) => 
        TestBed.runInInjectionContext(() => authGuard(...guardParameter));

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [HttpClientTestingModule, RouterTestingModule] });
    });

    it('Should Be Created', () => {
        expect(executeGuard).toBeTruthy();
    });
});