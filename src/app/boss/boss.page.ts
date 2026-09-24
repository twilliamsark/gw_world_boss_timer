import { Component, input } from '@angular/core';
import { Boss } from '../models/gw-boss.model';

@Component({
  selector: 'app-boss',
  template: `
    <div class="boss">
      <div class="boss__heading">
        <h2 class="boss__name">{{ boss()?.name }}</h2>
        @if (expandable()) {
          <span
            class="boss__chevron"
            [class.boss__chevron--open]="expanded()"
            aria-hidden="true"
          ></span>
        }
      </div>

      @if (expanded()) {
        <div class="boss__details" (click)="$event.stopPropagation()">
          @if (boss()?.chatlink) {
            <p class="boss__chatlink">{{ boss()?.chatlink }}</p>
          }
          @if (boss()?.description) {
            <p class="boss__description">{{ boss()?.description }}</p>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }

      .boss__heading {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        min-width: 0;
      }

      .boss__name {
        margin: 0;
        flex: 1 1 auto;
        min-width: 0;
        font-size: 1rem;
        font-weight: 600;
        line-height: 1.25;
        color: var(--ion-text-color);
      }

      .boss__chevron {
        flex: 0 0 auto;
        width: 8px;
        height: 8px;
        margin-top: 6px;
        border-right: 2px solid var(--ion-color-medium);
        border-bottom: 2px solid var(--ion-color-medium);
        transform: rotate(45deg);
        transition: transform 120ms ease;
        pointer-events: none;
      }

      .boss__chevron--open {
        transform: translateY(2px) rotate(225deg);
      }

      .boss__details {
        margin-top: 8px;
      }

      .boss__chatlink {
        margin: 0;
        font-size: 0.75rem;
        line-height: 1.3;
        color: var(--ion-color-medium-shade, var(--ion-color-medium));
        word-break: break-all;
      }

      .boss__description {
        margin: 6px 0 0;
        font-size: 0.85rem;
        line-height: 1.4;
        color: var(--ion-text-color-step-600, var(--ion-color-medium-shade));
      }
    `,
  ],
})
export class BossPage {
  boss = input<Boss>();
  expanded = input(false);
  expandable = input(false);
}
