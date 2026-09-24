import { Component, input } from '@angular/core';
import { IonCol, IonGrid, IonRow } from '@ionic/angular';
import { BossWithDuration } from '../models/gw-boss.model';
import { BossPage } from '../boss/boss.page';
import { BossDurationPage } from '../boss-duration/boss-duration.page';

@Component({
  selector: 'app-boss-with-duration',
  template: `
    <ion-grid>
      <ion-row>
        <ion-col size="auto">
          <app-boss-duration
            [index]="index()"
            [duration]="bossDuration()?.duration || 15"
          ></app-boss-duration>
        </ion-col>
        <ion-col>
          <app-boss [boss]="bossDuration()?.boss"></app-boss>
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
  styles: [
    `
      p {
        text-align: center;
        font-size: 20px;
        line-height: 26px;
      }
    `,
  ],
  standalone: true,
  imports: [IonCol, IonGrid, IonRow, BossPage, BossDurationPage],
})
export class BossWithDurationPage {
  index = input<number>(0);
  bossDuration = input<BossWithDuration>();
}
