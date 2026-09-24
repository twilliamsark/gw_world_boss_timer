import { DestroyRef, Service, inject, signal } from '@angular/core';

/** Shared wall-clock signal so many components can react to time without N timers. */
@Service()
export class ClockService {
  private readonly destroyRef = inject(DestroyRef);

  /** Current time; updates once per second. */
  readonly now = signal(new Date());

  constructor() {
    const id = setInterval(() => this.now.set(new Date()), 1000);
    this.destroyRef.onDestroy(() => clearInterval(id));
  }
}
