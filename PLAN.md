# PLAN.md — SleeperClass.live

## What this app is
A late-night Indian Railways sleeper-coach experience in a single HTML file:
ambient train sounds, passing stations, lo-fi night atmosphere. A niche
atmospheric experience, not a utility — judged against similar ambient /
atmospheric apps, not productivity tools.

## Architecture
- `index.html` — the entire app (markup, styles, script). No build step.
- `tests/journey.test.js` — Node tests for the `VN_Journey` pure helpers,
  extracted from `index.html` and evaluated in a sandbox.
- `assets/` — banner + screenshot art (original, by VN).

## Teardown (2026-10-14)
Three similar real apps were analyzed. Artifacts came only from official
GitHub repos (cloned, hashes below). REA
(`analyze-javascript-application`) was run on each repo directory; its graph
output was inventory-level, so concrete mechanisms were additionally confirmed
by reading the open-source code directly. **Nothing was copied**: mechanisms
were re-implemented in original code. No proprietary code, assets, strings,
brand names, or trademarks were taken. No copyrighted audio was added — all
new audio is synthesized live with WebAudio.

### 1. tuneindropout — stereoisfunky/tuneindropout
Zero-dependency ambient sound mixer (plain HTML/CSS/JS).
- Repo HEAD: `8361b65ab7f56f4ed6573c4ac2ce1c87287b418e`
- `js/audioEngine.js` SHA-256: `86f089f2a3e525f63c59ebea4dede61b10e2e114d8da114d6c610063aca5f29d`
- `js/app.js` SHA-256: `cfa5f154df45c8e0f3875b219ecca96798dd836ce4f242759311857ae0971d2a`
- Mechanisms learned: master **limiter** (DynamicsCompressor, −3 dB threshold,
  20:1) so stacked layers can't clip; **squared volume curve** for perceptual
  loudness; gapless loops via **equal-power crossfade baked into the buffer**
  (no JS timers, background-tab safe); RMS-based **loudness normalization**
  toward −13 dB; white/pink/brown noise generation; iOS unlock via inaudible
  oscillator pulse + resume on touch; binaural beats (two oscillators,
  carrier / carrier+beat, stereo panners); 6-band EQ chain.
- Implemented here: limiter, squared curves (ambient + music), audio-unlock
  hardening (resume on any pointerdown). EQ + binaural + baked crossfades
  deliberately skipped (see below).

### 2. noctune — karthiknvd/noctune
Minimalist ambient sound mixer (vanilla JS, HTML Audio elements).
- Repo HEAD: `2f23866ee2ab51c71015da43412d317e539be525`
- `script.js` SHA-256: `b36ff7692b554cc4e871258ae816ee59b68789036e9e88e99143ec24d52f84cb`
- Mechanisms learned: **named presets** (focus / sleep / rainyNight / …) that
  recall a whole mix with per-sound fades; **audio-driven particles** — particle
  counts distributed proportionally to each active sound's volume, with the
  train sound rendered as smoke streaking left for a motion illusion;
  **audio-driven lightning** — thunder volume above a threshold triggers
  distant lightning flashes; **ambient gradient lerp** — the background color
  eases toward the volume-weighted blend of active sounds' colors; card-click
  toggle 0 ↔ 0.5 with fade; audio unlock on first pointerdown.
- Implemented here: atmosphere presets, night-sky tint that lerps with the
  journey clock (same lerp idea, own keyframes), audio-driven ambience layers.

### 3. The Commute (the-curator) — manasvinoronha99/the-curator
Interactive late-night-train narrative (branching scenes, gaze system).
- Repo HEAD: `058dd4d83ecd08b506e3bce7133fd5825683818a`
- `script.js` SHA-256: `6364dad39b857da0ad3715d506e1b62eb28bed74ca2b84aef3f4e1b860a09ca6`
- Mechanisms learned: **scene-driven audio profiles** — every scene declares
  one profile (`low` / `medium` / `high` / `muted` / `tunnel` /
  `conversation`) mapped to a single gain ramp; **gaze system** — looking at
  window / passengers / phone changes view opacity AND audio profile (phone →
  muted); **tunnel event** — lighting class + raised train gain, auto-clears
  after ~3 s; emotional-state tracking (connection vs isolation) with per-choice
  deltas.
- Implemented here: tunnel events (darkened window + strobing tunnel lights +
  rumble swell, auto-clear), journey-clock phases as the profile driver.
  Branching narrative / gaze system / emotion tracking deliberately skipped.

## Implemented in this pass (2026-10-14)
1. **Journey clock + night phases** — 23:40 → 05:00, 1 real second =
   2 journey minutes while riding. Sky tint lerps with the clock, the moon
   arcs across the window and fades near dawn, phase label updates
   (Late Night → Deep Night → Pre-Dawn). Tap the clock to fast-forward
   30 minutes.
2. **Tunnel events** — every 45–90 s the train enters a tunnel: window
   dims, tunnel lights strobe past, rumble swells, then the night returns.
3. **Synthesized ambience layers** — Rain (band-passed noise + random droplet
   plinks), Crickets (chirp bursts), Distant Horn (low two-tone swell on a
   35–80 s schedule). Toggle chips in the control panel. WebAudio only.
4. **Master limiter + perceptual volume curves** — DynamicsCompressor on the
   master bus; ambient and music volumes use a squared curve.
5. **Retention hooks** — Atmosphere presets (Monsoon Night / Deep Sleep /
   Quiet Halt); **Share Journey** encodes station + mix + layers + clock into
   a `#j=…` link and restores it on load (validated decode, garbage rejected);
   **sleep timer** (15/30/60 min) fades the master bus over the final 15 s,
   then pauses and restores the bus.

## Deliberately skipped
- **Binaural beats / EQ chain** (tuneindropout): a sleep/atmosphere app gains
  little from a 6-band EQ; binaural claims need care. Skip, don't half-add.
- **Baked gapless loop crossfades + RMS normalization**: SleeperClass
  synthesizes its loops from live noise (no loop seam to bake); the YouTube
  radio is a third-party player whose samples we can't measure.
- **Branching narrative / gaze system / emotion tracking** (the-curator):
  would turn an ambient experience into a game; out of scope for this app.
- **Audio-file sound libraries**: zero-budget + no-copyrighted-audio rules;
  everything stays synthesized.
- **Sleep-timer fade of individual layers**: the timer fades the master bus,
  which covers all layers uniformly — simpler and correct.

## Known notes (pre-existing, not introduced here)
- The radio embeds third-party YouTube videos (Bollywood train songs). Those
  streams are the rights-holders' content served by YouTube, not files in this
  repo. This pass added no copyrighted audio and did not touch the radio
  engine except for the squared music-volume curve.
- `tests/journey.test.js` compares the decoded share-state via JSON because
  the helpers run in a `vm` sandbox realm (different `Object.prototype`).

## QA (2026-10-14)
- `node --check` on all 5 inline `<script>` blocks: PASS.
- `node --test tests/journey.test.js`: 7/7 PASS (phase boundaries, clock
  format, tint progression, moon arc, squared curve, share round-trip,
  invalid-state rejection).
- Served via `python3 -m http.server`, `curl` → HTTP 200, 52,343 bytes,
  new element IDs present (`journeyClock`, `vn-panel2`, `VN_Journey`,
  `tunnelOverlay`).
- NOT tested: real-browser playback (no live browser in this worker) —
  the coordinator should open the page, start the journey, and confirm the
  clock advances, a tunnel fires, layers toggle, and a preset applies.
