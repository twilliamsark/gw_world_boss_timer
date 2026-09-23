import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular';
import { BossWithDuration } from '../models/gw-boss.model';
import { WorldBossTimerService } from '../services/world-boss-timer.service';
import { BossPage } from '../boss/boss.page';

@Component({
  selector: 'app-home',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title>GW2 World Bosses</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">GW2 World Bosses</ion-title>
        </ion-toolbar>
      </ion-header>

      @if (events() !== null) {
        <ol>
          @for (event of encounters(); track $index) {
            <li class="boss-item">
              <app-boss [boss]="event.boss"></app-boss>
            </li>
          }
        </ol>
      }
    </ion-content>
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

      #container p {
        font-size: 16px;
        line-height: 22px;

        color: #8c8c8c;

        margin: 0;
      }

      #container a {
        text-decoration: none;
      }
      .boss-item {
        margin-bottom: 16px;
      }
    `,
  ],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, BossPage],
})
export class HomePage {
  private worldBossTimerService = inject(WorldBossTimerService);

  events = toSignal(this.worldBossTimerService.getBossSequence(), {
    initialValue: null,
  });
  encounters = computed((): BossWithDuration[] => {
    const sequence = this.events()?.encounters ?? [];
    return [...sequence, ...sequence, ...sequence, ...sequence];
  });
}
