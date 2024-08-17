import { HttpInterceptorFn } from '@angular/common/http';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenKey = 'authToken';
  const authToken = 'bearer '+localStorage.getItem(tokenKey);
  const request = req.clone({
    setHeaders: {
      Authorization: `${authToken}`
    }
  })
  return next(request);
};
