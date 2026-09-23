import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';

setGlobalOptions({
  region: 'us-central1',
  memory: '256MiB',
  timeoutSeconds: 10,
});

/**
 * Placeholder HTTP function so Hosting `/api/**` rewrites resolve.
 * Real wiki proxy/cache lands in PR 3.
 */
export const eventTimer = onRequest((req, res) => {
  if (req.method !== 'GET') {
    res.set('Allow', 'GET');
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  res.status(501).json({
    error: 'Not Implemented',
    message: 'Wiki event-timer proxy will be implemented in PR 3.',
  });
});
