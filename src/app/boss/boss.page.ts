import { Component, input } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/angular';

import { Boss } from '../models/gw-boss.model';

@Component({
  selector: 'app-boss',
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>{{ boss()?.name }}</ion-card-title>
        <ion-card-subtitle>{{ boss()?.chatlink }}</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        {{ boss()?.description }}
      </ion-card-content>
    </ion-card>
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
  imports: [
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
  ],
})
export class BossPage {
  boss = input<Boss>();
}
