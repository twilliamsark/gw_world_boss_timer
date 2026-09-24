import { Component, computed, inject, input } from '@angular/core';
import { ClockService } from '../services/clock.service';
import {
  bossSlotRemainingLabel,
  bossSlotStartMinutes,
  formatBossLocalTime,
  isBossSlotActive,
} from '../utils/boss-slot';

@Component({
  selector: 'app-boss-duration',
  template: `
    <div class="time-block" [class.time-block--active]="isActive()">
      <span class="time-block__start">{{ localStartTime() }}</span>
      <span class="time-block__sep" aria-hidden="true">–</span>
      <span class="time-block__end">{{ localEndTime() }}</span>
      @if (remainingLabel(); as remaining) {
        <span class="time-block__remaining" aria-live="polite">{{
          remaining
        }}</span>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .time-block {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
        min-width: 4.75rem;
        font-variant-numeric: tabular-nums;
        line-height: 1.2;
      }

      .time-block__start {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--ion-text-color);
      }

      .time-block__sep {
        display: none;
      }

      .time-block__end {
        font-size: 0.8rem;
        color: var(--ion-color-medium-shade, var(--ion-color-medium));
      }

      .time-block__remaining {
        margin-top: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--ion-color-primary);
      }

      .time-block--active .time-block__start {
        color: var(--ion-color-primary);
      }
    `,
  ],
})
export class BossDurationPage {
  private readonly clock = inject(ClockService);

  index = input<number>(0);
  duration = input<number>(15);

  localStartTime = computed(() =>
    formatBossLocalTime(bossSlotStartMinutes(this.index(), this.duration())),
  );

  localEndTime = computed(() =>
    formatBossLocalTime(
      bossSlotStartMinutes(this.index(), this.duration()) +
        (this.duration() || 15),
    ),
  );

  isActive = computed(() =>
    isBossSlotActive(this.index(), this.duration(), this.clock.now()),
  );

  remainingLabel = computed(() =>
    bossSlotRemainingLabel(this.index(), this.duration(), this.clock.now()),
  );
}
