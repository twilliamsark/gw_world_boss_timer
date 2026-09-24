import { Component, computed, inject, input } from '@angular/core';
import { BossWithDuration } from '../models/gw-boss.model';
import { BossPage } from '../boss/boss.page';
import { BossDurationPage } from '../boss-duration/boss-duration.page';
import { ClockService } from '../services/clock.service';

@Component({
  selector: 'app-boss-with-duration',
  template: `
    <article
      class="encounter"
      [class.encounter--active]="isActive()"
      [attr.aria-current]="isActive() ? 'time' : null"
    >
      @if (isActive()) {
        <span class="encounter__badge">Now</span>
      }

      <div class="encounter__body">
        <app-boss-duration
          class="encounter__time"
          [index]="index()"
          [duration]="bossDuration()?.duration || 15"
        ></app-boss-duration>

        <app-boss
          class="encounter__boss"
          [boss]="bossDuration()?.boss"
        ></app-boss>
      </div>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .encounter {
        position: relative;
        margin: 0 12px;
        padding: 12px 14px;
        border-radius: 14px;
        border: 1px solid
          var(--ion-color-step-150, rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.08));
        background: var(--ion-card-background, var(--ion-background-color));
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
      }

      .encounter--active {
        border-color: var(--ion-color-primary);
        background: rgba(var(--ion-color-primary-rgb), 0.12);
        box-shadow: 0 0 0 1px rgba(var(--ion-color-primary-rgb), 0.28);
      }

      @media (prefers-color-scheme: dark) {
        .encounter {
          border-color: rgba(var(--ion-text-color-rgb, 255, 255, 255), 0.12);
          box-shadow: none;
        }

        .encounter--active {
          background: rgba(var(--ion-color-primary-rgb), 0.22);
        }
      }

      .encounter__badge {
        position: absolute;
        top: 10px;
        right: 12px;
        padding: 2px 8px;
        border-radius: 999px;
        background: var(--ion-color-primary);
        color: var(--ion-color-primary-contrast, #fff);
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.02em;
        text-transform: uppercase;
      }

      .encounter__body {
        display: flex;
        align-items: flex-start;
        gap: 14px;
      }

      .encounter__time {
        flex: 0 0 auto;
      }

      .encounter__boss {
        flex: 1 1 auto;
        min-width: 0;
      }

      .encounter--active .encounter__boss {
        padding-right: 3.25rem;
      }

      @media (min-width: 768px) {
        .encounter {
          margin: 0 auto;
          max-width: 720px;
        }
      }
    `,
  ],
  imports: [BossPage, BossDurationPage],
})
export class BossWithDurationPage {
  private readonly clock = inject(ClockService);

  index = input<number>(0);
  bossDuration = input<BossWithDuration>();

  /** Mirrors BossDurationPage slot math so the row can highlight independently. */
  isActive = computed(() => {
    const now = this.clock.now();
    const nowMinutesUTC = now.getUTCHours() * 60 + now.getUTCMinutes();
    const duration = this.bossDuration()?.duration || 15;
    const start = (this.index() * duration) % (24 * 60);
    const end = start + duration;

    if (end <= 24 * 60) {
      return nowMinutesUTC >= start && nowMinutesUTC < end;
    }

    return nowMinutesUTC >= start || nowMinutesUTC < end - 24 * 60;
  });
}
