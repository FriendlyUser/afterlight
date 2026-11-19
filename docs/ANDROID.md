# Afterlight on Android

The Android app is the web game inside a [Capacitor](https://capacitorjs.com/) shell:
the same `dist/` that GitHub Pages serves, packaged with a small native project in
`android/`. Package name **`io.github.friendlyuser.afterlight`**, Capacitor 8, target
API 36 (what Google Play requires for new apps), minimum Android 7.0.

Everything Play-related lives in three places:

| Where | What |
|---|---|
| `android/`, `capacitor.config.json` | The native project. Edited by hand rarely; `npx cap sync android` refreshes the web files in it |
| `tools/android/`, `store/android/` | Release script, icon and screenshot tools; the listing text and pictures |
| `/home/david/claude_space/android-release/` | The signing kit, shared by every game (not in this repository) |
| `~/.android-release/` | **The upload key and its password. Back these two files up.** |

## Build a release

```bash
tools/android/release.sh
```

That is the whole release. It needs everything committed and pushed, because the
bundle is built on GitHub from what is on `main`:

1. it starts the **Android bundle** workflow (`.github/workflows/android.yml`),
2. waits about five minutes and downloads the result,
3. signs the bundle with your upload key and checks the signature.

It leaves two files in `release/android/` (not committed):

- `afterlight-<version>-<code>.aab` — **upload this to Play Console.**
- `afterlight-<version>-<code>-debug.apk` — the same build as an installable APK, for
  trying on a phone before you upload (see below).

**Version name** is `"version"` in `package.json` (or pass one:
`tools/android/release.sh 1.0.1`). **Version code** is the UTC date and hour,
`YYMMDDHH`, so every build is higher than the last without anyone keeping count.
Play refuses a bundle whose code it has seen, so build again rather than re-upload.

### Try it on a phone first

Nothing here has an Android device or emulator, so **the app has not been run on a
real phone yet.** The web side was tested in desktop Chrome with touch events
(`tests/touch.test.js`); the native side compiles and packages, but the first launch
is yours. Either:

- copy the `-debug.apk` to a phone and open it (allow "install unknown apps" for your
  file manager), or
- upload the `.aab` to Play Console's **Internal testing** track, add your own Google
  account as a tester, and install from the opt-in link. This is the better test: it
  is exactly what players will get.

Check, in this order: it opens fullscreen in landscape; the title screen fills the
screen with readable text; the D-pad and A/B work; sound plays; a save survives closing
the app; the back button backs out of menus; the screen stays on in a cutscene.

If the layout looks tiny or zoomed, the page scaling in `src/platform/Device.js` is the
place to look, with the matching `setUseWideViewPort` lines in `MainActivity.java`.

## First time on Google Play

1. **Developer account.** [play.google.com/console](https://play.google.com/console),
   US$25 once, identity verification. A *personal* account created after November 2023
   must run a **closed test with at least 12 testers opted in for 14 days** before
   Google allows a production release. Plan for that: it is the long pole.
2. **Create the app.** Name, default language, *Game*, *Free*. The package name comes
   from the first bundle you upload and can never change.
3. **App signing.** When you upload the first bundle, accept **Play App Signing** (the
   default). Google then holds the app's real signing key, and your upload key only
   proves the bundle came from you. That is why one upload key can serve every game.
4. **Store listing.** Paste from [`store/android/listing.md`](../store/android/listing.md);
   upload `icon-512.png`, `feature-graphic.jpg` and the eight screenshots. Mind the note
   there about the app's name.
5. **App content.** Privacy policy URL, ads, content rating, target audience, data
   safety: the answers are in the same file. The privacy policy is
   [`public/privacy.html`](../public/privacy.html), published with the site at
   <https://friendlyuser.github.io/afterlight/privacy.html>. Read it; it speaks for you.
6. **Release.** Testing → Internal testing → Create new release → upload the `.aab` →
   add testers. Then closed testing for the 14 days, then production.

## Updating the game

1. Change the game, bump `"version"` in `package.json` if players should see a new number.
2. Commit and push.
3. `tools/android/release.sh`
4. Play Console → the track you want → Create new release → upload the new `.aab`.

After changing anything under `android/` or adding a Capacitor plugin, run
`tools/npm.sh exec -- cap sync android` and commit what it changes.

## How the app differs from the web page

- **Touch controls** (`src/ui/TouchControls.js`): D-pad, A / B / ☰ / Y, L / R, and a
  `⋯` tray with Fast Mode, Map, Ride and a Run switch. They appear on first touch (in
  any browser, not just the app) and hide when a key or gamepad is used. A tap on the
  screen advances dialogue. Hints name the buttons instead of keys.
- **Layout** (`src/platform/Device.js`): on touch-first devices the page asks for a
  layout at least 1500 × 720 CSS pixels and the browser scales it to the screen, so the
  desktop UI fits a phone unchanged.
- **Shell** (`android/…/MainActivity.java`, `src/platform/Native.js`): landscape,
  fullscreen with the system bars hidden, screen kept on, music paused in the
  background, the back button mapped to Cancel (and to "leave the app" on the title).
  The game is kept clear of camera cutouts (`SystemBars.insetsHandling: "native"`).
- **Saves** are in the app's own storage and are included in Android's device backup.

### Known limits

- Menus are driven with the D-pad; list rows cannot be tapped directly. The controls
  go faint over a menu so it stays readable, but they do sit on top of it.
- Exporting a save file does nothing inside the app (a WebView has no downloads).
  Importing works. Saves themselves are unaffected.
- On tablets, Android 16 ignores the landscape lock. The game still runs in portrait,
  but it is laid out for landscape.
- A gamepad or keyboard should work as in a browser, but that is untested on Android.

## Tools

| Command | Does |
|---|---|
| `tools/android/release.sh [version]` | Build on GitHub, download, sign |
| `tools/android/make-icons.sh` | Redraw the icon (`tools/android/art/icon.html`) at every size |
| `tools/android/store-shots.sh [--preview] [name…]` | Retake the store screenshots and feature graphic |
| `SIM=240 tools/test.sh touch 200000` | Test the touch controls |
| `/home/david/claude_space/android-release/show-certificate.sh` | Print the upload key's fingerprints |

The icon and screenshot tools need the dev server (`python3 -m http.server 8765`).
