import { Component, computed, inject, input, signal } from '@angular/core';
import { BossWithDuration } from '../models/gw-boss.model';
import { BossPage } from './boss.page';
import { BossDurationPage } from './boss-duration.page';
import { ClockService } from '../services/clock.service';
import { isBossSlotActive } from '../utils/boss-slot';

@Component({
  selector: 'app-boss-with-duration',
  template: `
    <article
      class="encounter"
      [class.encounter--active]="isActive()"
      [class.encounter--expandable]="hasDetails()"
      [class.encounter--expanded]="expanded()"
      [attr.aria-current]="isActive() ? 'time' : null"
      [attr.aria-expanded]="hasDetails() ? expanded() : null"
      [attr.role]="hasDetails() ? 'button' : null"
      [attr.tabindex]="hasDetails() ? 0 : null"
      (click)="toggleExpanded()"
      (keydown.enter)="toggleExpanded()"
      (keydown.space)="onSpace($event)"
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
          [expanded]="expanded()"
          [expandable]="hasDetails()"
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
          var(
            --ion-color-step-150,
            rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.08)
          );
        background: var(--ion-card-background, var(--ion-background-color));
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
      }

      .encounter--expandable {
        cursor: pointer;
      }

      .encounter--expandable:focus-visible {
        outline: 2px solid var(--ion-color-primary);
        outline-offset: 2px;
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
        pointer-events: none;
      }

      .encounter__body {
        display: flex;
        align-items: flex-start;
        gap: 14px;
      }

      .encounter__time {
        flex: 0 0 auto;
        pointer-events: none;
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

  protected readonly expanded = signal(false);

  protected readonly hasDetails = computed(() => {
    const boss = this.bossDuration()?.boss;
    return !!(boss?.description || boss?.chatlink);
  });

  isActive = computed(() =>
    isBossSlotActive(
      this.index(),
      this.bossDuration()?.duration || 15,
      this.clock.now(),
    ),
  );

  protected toggleExpanded(): void {
    if (!this.hasDetails()) {
      return;
    }
    this.expanded.update((value) => !value);
  }

  protected onSpace(event: Event): void {
    event.preventDefault();
    this.toggleExpanded();
  }
}
