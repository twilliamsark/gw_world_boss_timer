# GW2 World Bosses

Upcoming Core Tyria world boss timer (Ionic / Angular / Firebase).

## Project paths

| Item | Value |
|------|-------|
| Local folder | `/Users/todd/dev/angular/projects/gw_world_boss_timer` |
| Firebase project | `gw2-world-boss-timer` |
| Design spec | [`docs/design-world-boss-timer.md`](docs/design-world-boss-timer.md) |

## Resolved scaffold versions

Recorded at scaffold time (Ionic CLI current peer matrix):

| Package | Version |
|---------|---------|
| `@ionic/angular` | `^9.0.0` |
| `@angular/core` | `22.1.7` |
| `@angular/cli` / `@angular/build` | `22.1.8` |
| `@capacitor/core` | `8.5.2` |
| Functions Node engine | `20` |
| Functions region | `us-central1` |
| `@angular/fire` | **Deferred** — latest published `@angular/fire@20` peers Angular `^20`; Ionic 9 scaffolded Angular **22**. Use Firebase CLI for Hosting/Functions deploy until AngularFire catches up. |

Exact lockfile pins are in `package-lock.json` and `functions/package-lock.json` after install.

## Prerequisites

- Node.js 20+ for local Ionic/Angular development (Functions runtime is Node 20).
- Firebase CLI logged in with access to `gw2-world-boss-timer`.
- **Blaze (pay-as-you-go)** on the Firebase project before deploying Cloud Functions that call the GW2 Wiki (see design KD 11). Set a budget alert.

## Scripts

```bash
# App
npm start                 # ng serve
npm run build             # production build → www/
npm test -- -c ci         # unit tests (Vitest, no watch)
npm run lint

# Functions (stub until PR 3)
npm --prefix functions install
npm --prefix functions run build
```

## Firebase

- `.firebaserc` already points at `gw2-world-boss-timer` — do not re-run `firebase init`.
- Hosting serves `www/` (Ionic production build).
- `/api/**` rewrites to the `eventTimer` Cloud Function (stub returns 501 until PR 3).
- Firestore / Auth stubs from Firebase CLI init remain unused in MVP.

## MVP roadmap (from design)

1. **Done (this scaffold):** Ionic Angular standalone + Firebase Hosting/Functions skeleton
2. Schedule engine (`core-wb`)
3. Wiki proxy Cloud Function
4. Client schedule service
5. Timer UI (current + next 3)
6. PWA polish

## Notes

- Official GW2 API does not expose world boss schedules; data comes from the wiki Event Timer JSON (`core-wb`).
- No client telemetry in MVP.
