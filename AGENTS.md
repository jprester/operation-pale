# Codex repository guidance

## Project goal
Build an interactive, cinematic documentary archive about **Operation: Pale**. Its primary mode is narrative exploration, not combat simulation or a game.

## Canon hierarchy
1. `docs/canon/CURRENT_CANON.md`: **read first.** Precedence between sources, current names, the film timeline, superseded and unresolved items, and the decision log.
2. Source documents in `docs/canon/sources/`, ranked in CURRENT_CANON §1. `Operation_Pale_Canon_Handoff_v2_4.md` is the highest-ranked source. Keep source files verbatim.
3. `docs/canon/superseded/`: historical reference only.
4. New creative material must be labelled **proposed**, never silently declared canon.
5. If canon is missing or contradictory, say so in your report. Do not invent figures or reconstruct missing documents (CURRENT_CANON §1 lists them).

## Engineering principles
- React + TypeScript + Vite + React Three Fiber.
- Narrative is structured data, not embedded in 3D component logic.
- Prefer native HTML for text, charts, navigation, captions, and accessibility.
- 3D is used for scenes that materially benefit (Earth, orbital structures, cameras).
- Keep a usable fallback for WebGL failures and reduced motion.
- Respect mobile performance and allow visitors to control pace.
- No backend, user tracking, or auth in the MVP.
- Avoid adding dependencies without a concrete reason.
- Do not copy third-party images, proprietary music, or real footage without clear licensing.
- Run `npm run build` after changes (or report installation/network blockers).
- Audio is generated locally (Kokoro TTS, Stable Audio 3); see `assets/audio/LOCAL_TOOLCHAIN.md`. No paid generation without the editor's explicit approval. You cannot hear audio: report commands, settings and file paths for the editor to audition.

## Editorial principles
- Documentary restraint: observational, analytically precise, understated.
- Do not turn every chapter into a dramatic battle; show administration, logistics, and human perspective.
- Preserve physical limits, finite manifest, technology-gap ceiling, imperfect intel, and human competence.
- The narrator is a human historian writing after the charter ended (CURRENT_CANON §8). The narrator knows outcomes, marks the limits of the record, and never states why Earth was acquired.
- The current introduction script is `docs/design/INTRODUCTION_V4_SCRIPT.md`. It supersedes the narration in earlier introduction documents.
- In technical visualizations distinguish *canonical figures*, *estimates*, and *artistic representation*.
- The opening Episode 1 should be built as a vertical slice before expanding to six years.
