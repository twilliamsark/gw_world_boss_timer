export interface Boss {
  id: number;
  name: string;
  description: string;
  chatlink: string;
}

export interface BossWithDuration {
  boss: Boss;
  duration: number;
}

export interface CombinedBossSequence {
  encounters: BossWithDuration[];
}
