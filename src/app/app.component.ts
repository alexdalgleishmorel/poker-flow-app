import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    // Check user's system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Apply the appropriate theme based on user's preference
    document.body.classList.toggle('dark', prefersDark);
  }
}
