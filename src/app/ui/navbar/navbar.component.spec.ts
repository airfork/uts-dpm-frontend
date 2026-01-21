import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      userData: {
        role: 'ADMIN',
        token: 'test-token',
        exp: 9999999999,
        username: 'admin@example.com',
      },
    });
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showInfo']);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;

    // Mock localStorage for theme testing
    spyOn(localStorage, 'getItem').and.returnValue('light');
    spyOn(localStorage, 'setItem');
    spyOn(document.documentElement, 'setAttribute');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have dropdown closed by default', () => {
      expect(component.isDropdownOpen()).toBe(false);
    });

    it('should have links defined', () => {
      expect(component.links).toBeDefined();
      expect(component.links.length).toBeGreaterThan(0);
    });

    it('should have navigation links with correct structure', () => {
      const dpmLink = component.links.find((l) => l.name === 'DPM');
      expect(dpmLink).toBeDefined();
      expect(dpmLink?.path).toBe('/dpm');
      expect(dpmLink?.allowedRoles).toContain('ADMIN');
    });

    it('should have logout link without path', () => {
      const logoutLink = component.links.find((l) => l.name === 'Logout');
      expect(logoutLink).toBeDefined();
      expect(logoutLink?.path).toBeUndefined();
    });
  });

  describe('toggleDropdown', () => {
    it('should toggle dropdown from closed to open', () => {
      expect(component.isDropdownOpen()).toBe(false);
      component.toggleDropdown();
      expect(component.isDropdownOpen()).toBe(true);
    });

    it('should toggle dropdown from open to closed', () => {
      component.isDropdownOpen.set(true);
      component.toggleDropdown();
      expect(component.isDropdownOpen()).toBe(false);
    });
  });

  describe('closeDropdown', () => {
    it('should close the dropdown', () => {
      component.isDropdownOpen.set(true);
      component.closeDropdown();
      expect(component.isDropdownOpen()).toBe(false);
    });
  });

  describe('menuItemClick', () => {
    it('should close dropdown', () => {
      component.isDropdownOpen.set(true);
      component.menuItemClick();
      expect(component.isDropdownOpen()).toBe(false);
    });

    it('should blur active element', () => {
      const mockElement = document.createElement('button');
      spyOn(mockElement, 'blur');
      spyOnProperty(document, 'activeElement', 'get').and.returnValue(mockElement);

      component.menuItemClick();

      expect(mockElement.blur).toHaveBeenCalled();
    });
  });

  describe('logoutClick', () => {
    it('should call menuItemClick', () => {
      spyOn(component, 'menuItemClick');
      component.logoutClick();
      expect(component.menuItemClick).toHaveBeenCalled();
    });

    it('should call authService.logout', () => {
      component.logoutClick();
      expect(authServiceSpy.logout).toHaveBeenCalled();
    });

    it('should navigate to login', fakeAsync(() => {
      component.logoutClick();
      tick();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('should show notification after navigation', fakeAsync(() => {
      component.logoutClick();
      tick();
      expect(notificationServiceSpy.showInfo).toHaveBeenCalledWith('Logged out');
    }));
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      component.currentTheme.set('light');
      component.toggleTheme();
      expect(component.currentTheme()).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      component.currentTheme.set('dark');
      component.toggleTheme();
      expect(component.currentTheme()).toBe('light');
    });

    it('should update document data-theme attribute', () => {
      component.currentTheme.set('light');
      component.toggleTheme();
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    });

    it('should save theme to localStorage', () => {
      component.currentTheme.set('light');
      component.toggleTheme();
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
  });

  describe('handleClickOutside', () => {
    it('should close dropdown when clicking outside', () => {
      component.isDropdownOpen.set(true);

      const mockTarget = document.createElement('div');
      const event = { target: mockTarget } as unknown as MouseEvent;

      component.handleClickOutside(event);
      expect(component.isDropdownOpen()).toBe(false);
    });
  });

  describe('handleEscapeKey', () => {
    it('should close dropdown on Escape key', () => {
      component.isDropdownOpen.set(true);
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.handleEscapeKey(event);
      expect(component.isDropdownOpen()).toBe(false);
    });

    it('should not close on other keys', () => {
      component.isDropdownOpen.set(true);
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.handleEscapeKey(event);
      expect(component.isDropdownOpen()).toBe(true);
    });
  });

  describe('document listeners', () => {
    it('should add listeners when dropdown opens', () => {
      spyOn(document, 'addEventListener');
      component.addDocumentListeners();
      expect(document.addEventListener).toHaveBeenCalledWith('click', component.handleClickOutside);
      expect(document.addEventListener).toHaveBeenCalledWith('keydown', component.handleEscapeKey);
    });

    it('should remove listeners when dropdown closes', () => {
      spyOn(document, 'removeEventListener');
      component.removeDocumentListeners();
      expect(document.removeEventListener).toHaveBeenCalledWith(
        'click',
        component.handleClickOutside
      );
      expect(document.removeEventListener).toHaveBeenCalledWith(
        'keydown',
        component.handleEscapeKey
      );
    });
  });

  describe('links configuration', () => {
    it('should have DPM link for ADMIN, ANALYST, MANAGER, SUPERVISOR', () => {
      const link = component.links.find((l) => l.name === 'DPM');
      expect(link?.allowedRoles).toEqual(['ADMIN', 'ANALYST', 'MANAGER', 'SUPERVISOR']);
    });

    it('should have Users link only for ADMIN', () => {
      const link = component.links.find((l) => l.name === 'Users');
      expect(link?.allowedRoles).toEqual(['ADMIN']);
    });

    it('should have Approvals link for ADMIN and MANAGER', () => {
      const link = component.links.find((l) => l.name === 'Approvals');
      expect(link?.allowedRoles).toEqual(['ADMIN', 'MANAGER']);
    });

    it('should have Logout link for all roles', () => {
      const link = component.links.find((l) => l.name === 'Logout');
      expect(link?.allowedRoles).toContain('ADMIN');
      expect(link?.allowedRoles).toContain('DRIVER');
    });
  });
});
