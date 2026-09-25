import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'cwb',
    loadComponent: () =>
      import('./core-world-bosses/core-world-bosses.page').then(
        (m) => m.HomePage,
      ),
  },
  {
    path: 'playground',
    loadComponent: () =>
      import('./playground/playground.page').then((m) => m.PlaygroundPage),
  },
  {
    path: 'home',
    redirectTo: 'cwb',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
