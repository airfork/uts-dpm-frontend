import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface NavLink {
  path: string;
  name: string;
}

@Component({
  selector: 'app-design-preview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './design-preview.component.html',
})
export class DesignPreviewComponent {
  showModal = signal(false);
  showToast = signal(false);
  toastType = signal<'success' | 'error' | 'info'>('success');

  // Navbar state
  activeNavLink = signal<string | null>(null);
  mobileMenuOpen = signal(false);

  navLinks: NavLink[] = [
    { path: '/dpm', name: 'DPM' },
    { path: '/autogen', name: 'Autogen' },
    { path: '/datagen', name: 'Datagen' },
    { path: '/approvals', name: 'Approvals' },
    { path: '/users', name: 'Users' },
  ];

  sampleDpms = [
    {
      id: 1,
      driver: 'John Smith',
      type: '5-10 Minutes Late to OFF',
      points: '-2',
      date: '01/10/2026',
      block: '12',
      time: '0800-1200',
      status: 'Reviewed',
    },
    {
      id: 2,
      driver: 'Jane Doe',
      type: 'Picked Up Block (+1 Point)',
      points: '+1',
      date: '01/09/2026',
      block: '8',
      time: '0600-1000',
      status: 'Pending',
    },
    {
      id: 3,
      driver: 'Mike Johnson',
      type: 'No Call No Show (-5 Points)',
      points: '-5',
      date: '01/08/2026',
      block: '15',
      time: '1400-1800',
      status: 'Escalated',
    },
  ];

  recentActivity = [
    { action: 'DPM Created', user: 'Admin', time: '2 min ago', icon: 'plus' },
    {
      action: 'Driver Updated',
      user: 'Manager',
      time: '15 min ago',
      icon: 'edit',
    },
    {
      action: 'Report Generated',
      user: 'System',
      time: '1 hour ago',
      icon: 'file',
    },
    {
      action: 'Block Assigned',
      user: 'Dispatcher',
      time: '3 hours ago',
      icon: 'calendar',
    },
  ];

  // Navbar methods
  setActiveLink(path: string) {
    this.activeNavLink.set(path);
    this.mobileMenuOpen.set(false);
  }

  goHome() {
    this.activeNavLink.set(null);
    this.mobileMenuOpen.set(false);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update((open) => !open);
  }

  logout() {
    this.activeNavLink.set(null);
    this.mobileMenuOpen.set(false);
    this.triggerToast('info');
  }

  // Modal methods
  openModal() {
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  triggerToast(type: 'success' | 'error' | 'info') {
    this.toastType.set(type);
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 3000);
  }
}
