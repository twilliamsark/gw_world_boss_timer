import { Component, computed, inject, input } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
} from '@ionic/angular';
import { ClockService } from '../services/clock.service';

@Component({
  selector: 'app-boss-duration',
  template: `
    <ion-card [class.highlight-card]="isNowBetweenLocalTimes()">
      <ion-card-header>
        <ion-card-subtitle>{{ localStartTime() }}</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content> {{ localEndTime() }} </ion-card-content>
    </ion-card>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 16px;
      }

      .highlight-card {
        border: 2px solid #3880ff;
        background-color: #f0f8ff;
      }
    `,
  ],
  imports: [IonCard, IonCardContent, IonCardHeader, IonCardSubtitle],
})
export class BossDurationPage {
  private readonly clock = inject(ClockService);

  index = input<number>(0);
  duration = input<number>(15);

  minutesSinceMidnightUTC = computed(
    () => this.index() * (this.duration() || 15),
  );
  startTime = computed(() => {
    const minutes = this.minutesSinceMidnightUTC();
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  });
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
  isNowBetweenLocalTimes = computed(() => {
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

  private formatLocalTime(minutesSinceMidnightUTC: number): string {
    const hours = Math.floor(minutesSinceMidnightUTC / 60) % 24;
    const mins = minutesSinceMidnightUTC % 60;
    const date = new Date();
    date.setUTCHours(hours, mins, 0, 0);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  isDaylightSavingTime = computed(() => {
    const date = new Date();
    const january = new Date(date.getFullYear(), 0, 1);
    const july = new Date(date.getFullYear(), 6, 1);
    const standardTimezoneOffset = Math.max(
      january.getTimezoneOffset(),
      july.getTimezoneOffset(),
    );
    return date.getTimezoneOffset() < standardTimezoneOffset;
  });
}
