import { Injectable, computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { CombinedBossSequence } from '../models/gw-boss.model';
import { environment } from '../../environments/environment';
import { ClockService } from './clock.service';

@Injectable({
  providedIn: 'root',
})
export class WorldBossTimerService {
  private readonly http = inject(HttpClient);
  private readonly clock = inject(ClockService);
  private readonly apiUrl = environment.bossesApiUrl;

  /**
   * Stable for an entire UTC calendar day; changes at 00:00 UTC so
   * `getBossSequence()` re-fetches when the day rolls over.
   */
  private readonly utcDayKey = computed(() => {
    const now = this.clock.now();
    return Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    );
  });

  private readonly bossSequence$ = toObservable(this.utcDayKey).pipe(
    switchMap(() => this.http.get<CombinedBossSequence>(this.apiUrl)),
  );

  getBossSequence(): Observable<CombinedBossSequence> {
    return this.bossSequence$;
  }
}
