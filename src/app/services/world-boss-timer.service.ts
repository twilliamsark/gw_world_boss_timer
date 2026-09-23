import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CombinedBossSequence } from '../models/gw-boss.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorldBossTimerService {
  private http = inject(HttpClient);
  private apiUrl = environment.bossesApiUrl;

  getBossSequence(): Observable<CombinedBossSequence> {
    return this.http.get<CombinedBossSequence>(this.apiUrl);
  }
}
