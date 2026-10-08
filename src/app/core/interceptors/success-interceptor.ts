import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';

export const successInterceptor: HttpInterceptorFn = (req, next) => {

  const toastrService = inject(ToastrService);

  return next(req).pipe(
    tap((event: any) => {

      if (req.method !== 'GET' && event?.body?.message) {
  toastrService.success(event.body.message);
}
    })
  );
};