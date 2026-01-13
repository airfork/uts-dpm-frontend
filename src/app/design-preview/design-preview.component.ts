import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-design-preview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './design-preview.component.html',
})
export class DesignPreviewComponent {
  selectedStyle = signal<'glassmorphism' | 'neubrutalism' | 'gradient-cards'>('glassmorphism');

  sampleDpms = [
    {
      id: 1,
      driver: 'John Smith',
      type: '5-10 Minutes Late to OFF',
      points: '-2',
      date: '01/10/2026',
      block: '12',
      time: '0800-1200',
    },
    {
      id: 2,
      driver: 'Jane Doe',
      type: 'Picked Up Block (+1 Point)',
      points: '+1',
      date: '01/09/2026',
      block: '8',
      time: '0600-1000',
    },
    {
      id: 3,
      driver: 'Mike Johnson',
      type: 'No Call No Show (-5 Points)',
      points: '-5',
      date: '01/08/2026',
      block: '15',
      time: '1400-1800',
    },
  ];

  setStyle(style: 'glassmorphism' | 'neubrutalism' | 'gradient-cards') {
    this.selectedStyle.set(style);
  }
}
