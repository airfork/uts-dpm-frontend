import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { hasPermissions, authGuard, authChildGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { Roles } from './roles.types';

describe('AuthGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated'], {
      userData: {
        role: 'ADMIN',
        token: 'test-token',
        exp: 9999999999,
        username: 'admin@example.com',
      },
    });
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  describe('hasPermissions', () => {
    it('should return true when authenticated and has allowed role', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);

      TestBed.runInInjectionContext(() => {
        const result = hasPermissions(['ADMIN', 'MANAGER'], '/dpm');
        expect(result).toBe(true);
      });
    });

    it('should redirect to 403 when authenticated but role not allowed', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);

      TestBed.runInInjectionContext(() => {
        const result = hasPermissions(['MANAGER'], '/dpm');
        expect(result).toBe(false);
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/errors/403']);
      });
    });

    it('should redirect to home when authenticated user visits login', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);

      TestBed.runInInjectionContext(() => {
        const result = hasPermissions(['ADMIN'], '/login');
        expect(result).toBe(false);
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
      });
    });

    it('should allow unauthenticated user to access login', () => {
      authServiceSpy.isAuthenticated.and.returnValue(false);

      TestBed.runInInjectionContext(() => {
        const result = hasPermissions([], '/login');
        expect(result).toBe(true);
      });
    });

    it('should redirect to login when not authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(false);

      TestBed.runInInjectionContext(() => {
        const result = hasPermissions(['ADMIN'], '/dpm');
        expect(result).toBe(false);
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      });
    });
  });

  describe('authGuard', () => {
    it('should call hasPermissions with route data', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);

      const route = {
        data: { allowedRoles: ['ADMIN', 'MANAGER'] as Roles[] },
      } as unknown as ActivatedRouteSnapshot;

      const state = {
        url: '/dpm',
      } as RouterStateSnapshot;

      TestBed.runInInjectionContext(() => {
        const result = authGuard(route, state);
        expect(result).toBe(true);
      });
    });
  });

  describe('authChildGuard', () => {
    it('should call hasPermissions with child route data', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);

      const childRoute = {
        data: { allowedRoles: ['ADMIN'] as Roles[] },
      } as unknown as ActivatedRouteSnapshot;

      const state = {
        url: '/users',
      } as RouterStateSnapshot;

      TestBed.runInInjectionContext(() => {
        const result = authChildGuard(childRoute, state);
        expect(result).toBe(true);
      });
    });

    it('should deny access for unauthorized child route', () => {
      // Create a new spy with DRIVER role for this test
      const driverAuthServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated'], {
        userData: {
          role: 'DRIVER',
          token: 'test-token',
          exp: 9999999999,
          username: 'driver@example.com',
        },
      });
      driverAuthServiceSpy.isAuthenticated.and.returnValue(true);

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          { provide: AuthService, useValue: driverAuthServiceSpy },
          { provide: Router, useValue: routerSpy },
        ],
      });

      const childRoute = {
        data: { allowedRoles: ['ADMIN'] as Roles[] },
      } as unknown as ActivatedRouteSnapshot;

      const state = {
        url: '/users',
      } as RouterStateSnapshot;

      TestBed.runInInjectionContext(() => {
        const result = authChildGuard(childRoute, state);
        expect(result).toBe(false);
      });
    });
  });
});
