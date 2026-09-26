import { Service, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { CombinedBossSequence } from '../models/gw-boss.model';
import { environment } from '../../environments/environment';
import { ClockService } from './clock.service';

@Service()
export class WorldBossTimerService {
  private readonly http = inject(HttpClient);
  private readonly clock = inject(ClockService);
  private readonly apiUrl = environment.bossesApiUrl;

  /**
   * Stable for an entire UTC calendar day; changes at 00:00 UTC so
   * `bossSequence` re-fetches when the day rolls over.
   */
  private readonly utcDayKey = computed(() => {
    const now = this.clock.now();
    return Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    );
  });

  /** Async boss schedule for the current UTC day. */
  readonly bossSequence = rxResource({
    params: () => this.utcDayKey(),
    stream: () => this.http.get<CombinedBossSequence>(this.apiUrl),
  });
}
