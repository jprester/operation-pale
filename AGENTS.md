# Codex repository guidance

## Project goal
Build an interactive, cinematic documentary archive about **Operation: Pale**. Its primary mode is narrative exploration, not combat simulation or a game.

## Canon hierarchy
1. `docs/canon/Operation_Pale_Canon_Handoff_v2_0.md` — highest authority in this repo.
2. `docs/canon/operation_pale_narrative_v1_5.md` — older narrative; use only where v2.0 does not supersede it.
3. `docs/canon/operation_pale_equipment_directory_v1.md` — legacy equipment detail; many names/quantities obsolete.
4. New creative material must be labelled as **proposed**, never silently declared canon.

**Naming note:** later conversation decisions renamed Wain → Caravan, Seneschal → Legate, Works → Foundry network (Alpha/Beta/Gamma/Delta). The bundled v2.0 document still uses older names. In UI use newer names; preserve original document copies unchanged. More recent v2.1 equipment discussion exists but its full directory is not bundled; do not fabricate its final figures.

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

## Editorial principles
- Documentary restraint: observational, analytically precise, understated.
- Do not turn every chapter into a dramatic battle; show administration, logistics, and human perspective.
- Preserve physical limits, finite manifest, technology-gap ceiling, imperfect intel, and human competence.
- In technical visualizations distinguish *canonical figures*, *estimates*, and *artistic representation*.
- The opening Episode 1 should be built as a vertical slice before expanding to six years.
