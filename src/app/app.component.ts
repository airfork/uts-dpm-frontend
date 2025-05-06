import { Component, OnInit } from '@angular/core';
import { PrimeNG } from 'primeng/config';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  title = 'uts-new-dpm';

  constructor(private primeNG: PrimeNG) {}

  ngOnInit() {
    this.primeNG.ripple.set(true);
  }
}
