export const environment = {
  production: false,
  /** Hosting rewrite → Cloud Function `eventTimer` (implemented in PR 3). */
  eventTimerUrl: '/api/event-timer',
  /** Public Vercel API for boss sequence data. */
  bossesApiUrl: 'http://localhost:3001/api/bosses/gw',
  firebase: {
    apiKey: '',
    authDomain: 'gw2-world-boss-timer.firebaseapp.com',
    projectId: 'gw2-world-boss-timer',
    storageBucket: 'gw2-world-boss-timer.appspot.com',
    messagingSenderId: '',
    appId: '',
  },
};
