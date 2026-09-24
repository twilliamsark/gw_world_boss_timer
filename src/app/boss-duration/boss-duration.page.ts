import { Component, input } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/angular';

@Component({
  selector: 'app-boss-duration',
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>{{ index() }}</ion-card-title>
      </ion-card-header>
      <ion-card-content> {{ duration() }} minutes </ion-card-content>
    </ion-card>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 16px;
      }
    `,
  ],
  imports: [IonCard, IonCardContent, IonCardHeader, IonCardTitle],
})
export class BossDurationPage {
  index = input<number>(0);
  duration = input<number>(15);
}
