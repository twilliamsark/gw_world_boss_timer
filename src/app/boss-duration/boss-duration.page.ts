import { Component, computed, inject, input } from '@angular/core';
import { ClockService } from '../services/clock.service';

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

  minutesSinceMidnightUTC = computed(
    () => this.index() * (this.duration() || 15),
  );

  localStartTime = computed(() =>
    this.formatLocalTime(this.minutesSinceMidnightUTC()),
  );

  localEndTime = computed(() =>
    this.formatLocalTime(
      this.minutesSinceMidnightUTC() + (this.duration() || 15),
    ),
  );

  /**
   * Slots are defined in UTC minutes-since-midnight. Reads `clock.now` so the
   * highlight advances as wall time ticks.
   */
  isActive = computed(() => {
    const now = this.clock.now();
    const nowMinutesUTC = now.getUTCHours() * 60 + now.getUTCMinutes();
    const start = this.minutesSinceMidnightUTC() % (24 * 60);
    const duration = this.duration() || 15;
    const end = start + duration;

    if (end <= 24 * 60) {
      return nowMinutesUTC >= start && nowMinutesUTC < end;
    }

    // Slot crosses UTC midnight (e.g. 23:45–00:00).
    return nowMinutesUTC >= start || nowMinutesUTC < end - 24 * 60;
  });

  remainingLabel = computed(() => {
    if (!this.isActive()) {
      return null;
    }

    const now = this.clock.now();
    const start = this.minutesSinceMidnightUTC() % (24 * 60);
    const duration = this.duration() || 15;
    const endTotal = start + duration;

    const endDate = new Date(now);
    endDate.setUTCSeconds(0, 0);
    const nowMinutesUTC = now.getUTCHours() * 60 + now.getUTCMinutes();

    if (endTotal <= 24 * 60) {
      endDate.setUTCHours(Math.floor(endTotal / 60), endTotal % 60, 0, 0);
    } else {
      const wrapped = endTotal - 24 * 60;
      // Still in the pre-midnight portion → end is tomorrow UTC.
      if (nowMinutesUTC >= start) {
        endDate.setUTCDate(endDate.getUTCDate() + 1);
      }
      endDate.setUTCHours(Math.floor(wrapped / 60), wrapped % 60, 0, 0);
    }

    const remainingMs = Math.max(0, endDate.getTime() - now.getTime());
    const totalSeconds = Math.floor(remainingMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes <= 0) {
      return `${seconds}s left`;
    }

    return `${minutes}m ${seconds.toString().padStart(2, '0')}s left`;
  });

  private formatLocalTime(minutesSinceMidnightUTC: number): string {
    const hours = Math.floor(minutesSinceMidnightUTC / 60) % 24;
    const mins = minutesSinceMidnightUTC % 60;
    const date = new Date();
    date.setUTCHours(hours, mins, 0, 0);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
}
