import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authData = localStorage.getItem('authData');

  // Si l'utilisateur est connecté, on clone la requête pour ajouter le header
  if (authData) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Basic ${authData}`
      }
    });
    return next(cloned);
  }

  // Sinon on laisse passer la requête telle quelle (ex: pour Register)
  return next(req);
};
