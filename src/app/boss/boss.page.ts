import { Component, input } from '@angular/core';
import { Boss } from '../models/gw-boss.model';

@Component({
  selector: 'app-boss',
  template: `
    <ul>
      <li>{{ boss()?.name }}</li>
      <li>{{ boss()?.description }}</li>
    </ul>
  `,
  styles: [
    `
      #container {
        text-align: center;

        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }

      #container strong {
        font-size: 20px;
        line-height: 26px;
      }
    `,
  ],
  standalone: true,
  imports: [],
})
export class BossPage {
  boss = input<Boss>();
}
