import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <div class="content">
  <router-outlet></router-outlet>
  </div>
  `
})
export class AppComponent {
   title = 'angular-pokedex';
}
