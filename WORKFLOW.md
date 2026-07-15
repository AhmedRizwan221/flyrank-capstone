# WORKFLOW.md

## Objective
Compare AI-assisted implementation quality between a vague prompt
(round1-vague-prompt) and a precise, constraint-driven prompt
(round2-precise-prompt) for the same React settings form.

## Key Findings

- **Prompt precision changes scope, not just quality.** The vague prompt
  produced a *richer* form (7 fields, checkboxes, bio counter, success
  state) because the AI filled ambiguity with plausible features. The
  precise prompt produced a *narrower* form (4 fields) because it followed
  the spec literally and dropped anything unspecified — precision traded
  breadth for correctness.
- **Schema-based validation (zod + react-hook-form) is more maintainable**
  than hand-rolled `switch`-based validation, but must be checked against
  the original spec — round2's password rule (8-char min only) was
  weaker than round1's (8-char + uppercase + number).
- **Accessibility improved but wasn't finished.** round2 added
  `aria-invalid` and `role="alert"`, which round1 lacked entirely — but
  still omitted `aria-describedby` linking inputs to their errors.
- **AI introduced a concrete bug undetected by its own tests**: mojibake
  placeholder text (`ΓÇóΓÇó...`) in `SettingsForm.jsx`, which the
  generated test file then asserted against verbatim — a case where
  AI-written tests validated the bug instead of catching it.
- **Dead code / file-scope mismatch**: `App.css` retained unrelated Vite
  boilerplate CSS after the rewrite; actual form styles were placed in
  `index.css` using unscoped element selectors, risking style leakage.
- **Feature regressions must be tracked explicitly.** Precise prompts
  should include an explicit "must preserve" list (success state, all
  fields, hint text) when refactoring, not just new constraints — round2
  silently dropped the success confirmation UI.

## Process Improvements for Future Rounds
- Always diff the generated code against the *previous* implementation's
  feature list before accepting a "precise" rewrite, so intentional cuts
  are distinguished from silent regressions.
- Request the AI explicitly test rendered output (not just prop/behavior
  assertions) to catch encoding/rendering bugs like the mojibake
  placeholder.
- Add a repo-wide lint/check step for orphaned CSS selectors so dead
  boilerplate doesn't survive a rewrite.
- When precision constraints are given, pair them with a short "preserve
  these existing behaviors" list to prevent scope loss.
- Treat AI-generated tests as a starting point, not a correctness oracle —
  they can encode the same bug they're meant to catch.