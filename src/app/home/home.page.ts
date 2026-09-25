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
import {
  bossSlotRemainingLabel,
  bossSlotStartMinutes,
  formatBossLocalTime,
  isBossSlotActive,
} from '../utils/boss-slot';

/** Offset so the active card sits below the app header + now summary. */
const HEADER_SCROLL_OFFSET_PX = 168;

@Component({
  selector: 'app-home',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title>GW2 World Bosses</ion-title>
      </ion-toolbar>

      @if (activeEncounter(); as active) {
        <ion-toolbar class="now-toolbar">
          <div class="now-summary" aria-live="polite">
            <div class="now-summary__top">
              <span class="now-summary__badge">Now</span>
              <span class="now-summary__name">{{ active.boss.name }}</span>
            </div>
            <div class="now-summary__meta">
              <span
                >{{ activeStartTime() }} – {{ activeEndTime() }}</span
              >
              @if (activeRemaining(); as remaining) {
                <span class="now-summary__remaining">{{ remaining }}</span>
              }
            </div>
            @if (active.boss.description) {
              <p class="now-summary__description">
                {{ active.boss.description }}
              </p>
            }
          </div>
        </ion-toolbar>
      }
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">GW2 World Bosses</ion-title>
        </ion-toolbar>
      </ion-header>

      @if (events() !== null) {
        <ul class="boss-list">
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
      .now-toolbar {
        --min-height: 0;
        --padding-top: 0;
        --padding-bottom: 0;
        --padding-start: 0;
        --padding-end: 0;
      }

      .now-summary {
        width: 100%;
        padding: 10px 16px 12px;
        border-top: 1px solid
          rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.08);
        background: rgba(var(--ion-color-primary-rgb), 0.12);
        text-align: center;
      }

      .now-summary__top {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-width: 0;
      }

      .now-summary__badge {
        flex: 0 0 auto;
        padding: 2px 8px;
        border-radius: 999px;
        background: var(--ion-color-primary);
        color: var(--ion-color-primary-contrast, #fff);
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.02em;
        text-transform: uppercase;
      }

      .now-summary__name {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 1rem;
        font-weight: 650;
        line-height: 1.25;
        color: var(--ion-text-color);
      }

      .now-summary__meta {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        justify-content: center;
        gap: 8px 12px;
        margin-top: 4px;
        font-size: 0.8rem;
        font-variant-numeric: tabular-nums;
        color: var(--ion-color-medium-shade, var(--ion-color-medium));
      }

      .now-summary__remaining {
        font-weight: 650;
        color: var(--ion-color-primary);
      }

      .now-summary__description {
        margin: 6px 0 0;
        font-size: 0.8rem;
        line-height: 1.35;
        text-align: center;
        color: var(--ion-text-color-step-600, var(--ion-color-medium-shade));
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }

      @media (prefers-color-scheme: dark) {
        .now-summary {
          border-top-color: rgba(var(--ion-text-color-rgb, 255, 255, 255), 0.12);
          background: rgba(var(--ion-color-primary-rgb), 0.22);
        }
      }

      .boss-list {
        list-style: none;
        margin: 0;
        padding: 8px 0 calc(24px + env(safe-area-inset-bottom, 0px));
      }

      .boss-item {
        margin-bottom: 10px;
      }

      .boss-item:last-child {
        margin-bottom: 0;
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

  /** Same UTC slot math as BossDurationPage — stable until the slot changes. */
  activeIndex = computed(() => {
    const now = this.clock.now();
    const list = this.encounters();

    for (let i = 0; i < list.length; i++) {
      if (isBossSlotActive(i, list[i].duration || 15, now)) {
        return i;
      }
    }

    return 0;
  });

  activeEncounter = computed((): BossWithDuration | null => {
    const list = this.encounters();
    if (list.length === 0) {
      return null;
    }
    return list[this.activeIndex()] ?? null;
  });

  activeStartTime = computed(() => {
    const active = this.activeEncounter();
    if (!active) {
      return '';
    }
    return formatBossLocalTime(
      bossSlotStartMinutes(this.activeIndex(), active.duration || 15),
    );
  });

  activeEndTime = computed(() => {
    const active = this.activeEncounter();
    if (!active) {
      return '';
    }
    const duration = active.duration || 15;
    return formatBossLocalTime(
      bossSlotStartMinutes(this.activeIndex(), duration) + duration,
    );
  });

  activeRemaining = computed(() => {
    const active = this.activeEncounter();
    if (!active) {
      return null;
    }
    return bossSlotRemainingLabel(
      this.activeIndex(),
      active.duration || 15,
      this.clock.now(),
    );
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
