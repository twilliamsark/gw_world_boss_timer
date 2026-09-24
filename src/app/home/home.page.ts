import {
  afterRenderEffect,
  Component,
  computed,
  ElementRef,
  inject,
  viewChild,
  viewChildren,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular';
import { BossWithDuration } from '../models/gw-boss.model';
import { ClockService } from '../services/clock.service';
import { WorldBossTimerService } from '../services/world-boss-timer.service';
import { BossWithDurationPage } from '../boss-with-duration/boss-with-duration.page';

/** Offset so the active card sits below the app toolbar. */
const HEADER_SCROLL_OFFSET_PX = 72;

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
        <ul style="list-style-type: none; padding: 0; margin: 0">
          @for (event of encounters(); track $index; let i = $index) {
            <li #bossItem class="boss-item">
              <app-boss-with-duration
                [index]="i"
                [bossDuration]="event"
              ></app-boss-with-duration>
            </li>
          }
        </ul>
      }
    </ion-content>
  `,
  styles: [
    `
      .boss-item {
        margin-bottom: 16px;
      }
    `,
  ],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, BossWithDurationPage],
})
export class HomePage {
  private readonly worldBossTimerService = inject(WorldBossTimerService);
  private readonly clock = inject(ClockService);

  private readonly content = viewChild(IonContent);
  private readonly bossItems =
    viewChildren<ElementRef<HTMLElement>>('bossItem');

  events = toSignal(this.worldBossTimerService.getBossSequence(), {
    initialValue: null,
  });
  encounters = computed((): BossWithDuration[] => {
    const sequence = this.events()?.encounters ?? [];
    return [...sequence, ...sequence, ...sequence, ...sequence];
  });

  /** Same UTC window math as BossDurationPage — stable until the slot changes. */
  activeIndex = computed(() => {
    const now = this.clock.now();
    const nowMinutesUTC = now.getUTCHours() * 60 + now.getUTCMinutes();
    const list = this.encounters();

    for (let i = 0; i < list.length; i++) {
      const duration = list[i].duration || 15;
      const start = (i * duration) % (24 * 60);
      const end = start + duration;
      const active =
        end <= 24 * 60
          ? nowMinutesUTC >= start && nowMinutesUTC < end
          : nowMinutesUTC >= start || nowMinutesUTC < end - 24 * 60;
      if (active) {
        return i;
      }
    }

    return 0;
  });

  constructor() {
    afterRenderEffect({
      write: () => {
        const index = this.activeIndex();
        const items = this.bossItems();
        const content = this.content();
        const el = items[index]?.nativeElement;
        if (!content || !el) {
          return;
        }

        void this.scrollActiveBossToTop(content, el);
      },
    });
  }

  private async scrollActiveBossToTop(
    content: IonContent,
    el: HTMLElement,
  ): Promise<void> {
    const scrollEl = await content.getScrollElement();

    // ion-content + @for list need a frame to finish layout before measuring.
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );

    const y =
      el.getBoundingClientRect().top -
      scrollEl.getBoundingClientRect().top +
      scrollEl.scrollTop -
      HEADER_SCROLL_OFFSET_PX;

    await content.scrollToPoint(0, Math.max(0, y), 300);
  }
}
