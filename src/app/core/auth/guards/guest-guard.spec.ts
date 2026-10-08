import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CanActivateFn } from '@angular/router';
import { guestGuard } from './guest-guard';


describe('guestGuard', () => {
    const executeGuard: CanActivateFn = (...guardParameters) => 
        TestBed.runInInjectionContext(() => guestGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [HttpClientTestingModule, RouterTestingModule] });
    });

    it('Should Be Created', () => {
        expect(executeGuard).toBeTruthy();
    })
})