# First task for Codex

**Goal:** Turn the current repository into a polished *60–90-second cinematic introduction prototype*, keeping the existing chapter archive usable.

1. Install dependencies and run the current app. Fix any TypeScript/build problems before expanding functionality.
2. Improve the opening composition and planet quality without depending on externally downloaded art. Prefer a clearly stylized globe over fake geographic accuracy.
3. Break the introduction into 3–4 timed or user-advanced beats; avoid forcing audio autoplay. Include skip and pause/continue controls.
4. Add `prefers-reduced-motion`, WebGL-unavailable fallback, keyboard navigation, and phone layout verification.
5. Keep all narrative copy in typed content files; do not bake narration into animations.
6. Make the Notification chapter visually distinct, including a readable, caption-ready transcript area. Use the layered schedule in canon v2.0; do not reproduce v1.5's longer initial speech as if still canonical.
7. Verify production build; summarize remaining gaps rather than claiming an entire episode is finished.

**Acceptance criteria:** A visitor can open the URL, see a high-quality opening, proceed without audio or WebGL, understand the project's premise, and navigate the chapter archive on mobile and desktop.

**Avoid:** backend, sign-in, full Earth simulation, new equipment specs, dozens of hero animations, unrelated UI libraries, and claims that proposed scenes are canonical.
