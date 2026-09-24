/** UTC minutes-since-midnight for the start of a schedule slot. */
export function bossSlotStartMinutes(
  index: number,
  duration: number = 15,
): number {
  return index * (duration || 15);
}

/** Whether `now` falls inside the UTC slot for `index`. */
export function isBossSlotActive(
  index: number,
  duration: number,
  now: Date,
): boolean {
  const nowMinutesUTC = now.getUTCHours() * 60 + now.getUTCMinutes();
  const start = bossSlotStartMinutes(index, duration) % (24 * 60);
  const end = start + (duration || 15);

  if (end <= 24 * 60) {
    return nowMinutesUTC >= start && nowMinutesUTC < end;
  }

  // Slot crosses UTC midnight (e.g. 23:45–00:00).
  return nowMinutesUTC >= start || nowMinutesUTC < end - 24 * 60;
}

/** Format a UTC minutes-since-midnight value as a local wall-clock time. */
export function formatBossLocalTime(minutesSinceMidnightUTC: number): string {
  const hours = Math.floor(minutesSinceMidnightUTC / 60) % 24;
  const mins = minutesSinceMidnightUTC % 60;
  const date = new Date();
  date.setUTCHours(hours, mins, 0, 0);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/** Countdown label for an active slot, or `null` when the slot is inactive. */
export function bossSlotRemainingLabel(
  index: number,
  duration: number,
  now: Date,
): string | null {
  if (!isBossSlotActive(index, duration, now)) {
    return null;
  }

  const start = bossSlotStartMinutes(index, duration) % (24 * 60);
  const slotDuration = duration || 15;
  const endTotal = start + slotDuration;

  const endDate = new Date(now);
  endDate.setUTCSeconds(0, 0);
  const nowMinutesUTC = now.getUTCHours() * 60 + now.getUTCMinutes();

  if (endTotal <= 24 * 60) {
    endDate.setUTCHours(Math.floor(endTotal / 60), endTotal % 60, 0, 0);
  } else {
    const wrapped = endTotal - 24 * 60;
    // Still in the pre-midnight portion → end is tomorrow UTC.
    if (nowMinutesUTC >= start) {
      endDate.setUTCDate(endDate.getUTCDate() + 1);
    }
    endDate.setUTCHours(Math.floor(wrapped / 60), wrapped % 60, 0, 0);
  }

  const remainingMs = Math.max(0, endDate.getTime() - now.getTime());
  const totalSeconds = Math.floor(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes <= 0) {
    return `${seconds}s left`;
  }

  return `${minutes}m ${seconds.toString().padStart(2, '0')}s left`;
}
