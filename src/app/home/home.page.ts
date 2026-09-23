import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular';
import { WorldBossTimerService } from '../services/world-boss-timer.service';

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
        <ul>
          @for (event of encounters(); track event.boss.id) {
            <li>{{ event.boss.name }}</li>
          }
        </ul>
      }

      <div id="container">
        <strong>World boss timer scaffold</strong>
        <p>
          Ionic Angular app is ready on Firebase project
          <code>gw2-world-boss-timer</code>. Schedule engine and timer UI land
          in later PRs.
        </p>
      </div>
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
    `,
  ],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  private worldBossTimerService = inject(WorldBossTimerService);

  events = toSignal(this.worldBossTimerService.getBossSequence(), {
    initialValue: null,
  });
  encounters = computed(() => this.events()?.encounters || []);
}
