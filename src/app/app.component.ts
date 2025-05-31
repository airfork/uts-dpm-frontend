import { Component, OnInit, inject } from '@angular/core';
import { PrimeNG } from 'primeng/config';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  private primeNG = inject(PrimeNG);

  title = 'uts-new-dpm';

  ngOnInit() {
    this.primeNG.ripple.set(true);
  }
}
