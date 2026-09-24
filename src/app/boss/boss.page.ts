import { Component, input, signal } from '@angular/core';
import { Boss } from '../models/gw-boss.model';

@Component({
  selector: 'app-boss',
  template: `
    <div class="boss">
      <div class="boss__heading">
        <h2 class="boss__name">{{ boss()?.name }}</h2>
        @if (boss()?.description || boss()?.chatlink) {
          <button
            type="button"
            class="boss__toggle"
            [attr.aria-expanded]="expanded()"
            [attr.aria-label]="
              expanded() ? 'Hide boss details' : 'Show boss details'
            "
            (click)="toggleDetails($event)"
          >
            <span
              class="boss__chevron"
              [class.boss__chevron--open]="expanded()"
              aria-hidden="true"
            ></span>
          </button>
        }
      </div>

      @if (expanded()) {
        @if (boss()?.chatlink) {
          <p class="boss__chatlink">{{ boss()?.chatlink }}</p>
        }
        @if (boss()?.description) {
          <p class="boss__description">{{ boss()?.description }}</p>
        }
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

      .boss__toggle {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        margin: -4px -6px 0 0;
        padding: 0;
        border: 0;
        border-radius: 999px;
        background: transparent;
        color: var(--ion-color-medium);
        cursor: pointer;
      }

      .boss__toggle:focus-visible {
        outline: 2px solid var(--ion-color-primary);
        outline-offset: 2px;
      }

      .boss__chevron {
        width: 8px;
        height: 8px;
        border-right: 2px solid currentColor;
        border-bottom: 2px solid currentColor;
        transform: rotate(45deg);
        transition: transform 120ms ease;
      }

      .boss__chevron--open {
        transform: translateY(2px) rotate(225deg);
      }

      .boss__chatlink {
        margin: 8px 0 0;
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

  protected readonly expanded = signal(false);

  protected toggleDetails(event: Event): void {
    event.stopPropagation();
    this.expanded.update((value) => !value);
  }
}
