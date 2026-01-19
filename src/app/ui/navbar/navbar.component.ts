import { Component, inject, signal, effect } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { Roles } from '../../auth/roles.types';
import { RemoveIfUnauthorizedDirective } from '../../auth/directives/remove-if-unauthorized.directive';

interface navbarLinks {
  path?: string;
  name: string;
  allowedRoles: Roles[];
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [RouterLink, RouterLinkActive, RemoveIfUnauthorizedDirective],
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  isDropdownOpen = signal(false);
  currentTheme = signal<'light' | 'dark'>(
    typeof window !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'dark'
      : 'light'
  );

  constructor() {
    effect(() => {
      if (this.isDropdownOpen()) {
        this.addDocumentListeners();
      } else {
        this.removeDocumentListeners();
      }
    });
  }

  links: navbarLinks[] = [
    {
      path: '/dpm',
      name: 'DPM',
      allowedRoles: ['ADMIN', 'ANALYST', 'MANAGER', 'SUPERVISOR'],
    },
    {
      path: '/autogen',
      name: 'Autogen',
      allowedRoles: ['ADMIN', 'ANALYST', 'MANAGER', 'SUPERVISOR'],
    },
    {
      path: '/datagen',
      name: 'Datagen',
      allowedRoles: ['ADMIN', 'ANALYST', 'MANAGER'],
    },
    {
      path: '/approvals',
      name: 'Approvals',
      allowedRoles: ['ADMIN', 'MANAGER'],
    },
    { path: '/users', name: 'Users', allowedRoles: ['ADMIN'] },
    {
      name: 'Logout',
      allowedRoles: ['ADMIN', 'ANALYST', 'DRIVER', 'MANAGER', 'SUPERVISOR'],
    },
  ];

  toggleDropdown() {
    this.isDropdownOpen.update((open) => !open);
  }

  closeDropdown() {
    this.isDropdownOpen.set(false);
  }

  menuItemClick() {
    this.closeDropdown();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  logoutClick() {
    this.menuItemClick();
    this.authService.logout();
    this.router.navigate(['/login']).then(() => this.notificationService.showInfo('Logged out'));
  }

  toggleTheme() {
    const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.currentTheme.set(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const dropdown = document.getElementById('menuButton')?.closest('.relative');
    if (dropdown && !dropdown.contains(target)) {
      this.closeDropdown();
    }
  };

  handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.closeDropdown();
    }
  };

  addDocumentListeners() {
    document.addEventListener('click', this.handleClickOutside);
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  removeDocumentListeners() {
    document.removeEventListener('click', this.handleClickOutside);
    document.removeEventListener('keydown', this.handleEscapeKey);
  }
}
