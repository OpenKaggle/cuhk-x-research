# CUHK-X control-plane snapshot

Snapshot: 2026-09-11 CST

This project-local snapshot records the Large-track controls inherited from `../CUHK_X_CONTROL_PLANE.md` at the v9 reproducibility freeze.

- Every new Large VLM cohort must first pass a label-blind readability and minimum-frame preflight.
- The preflight must atomically reserve all QA IDs and clip keys in the append-only exposure registry before protocol freeze.
- Any collision, unreadable/short clip, malformed manifest, registry parse error, or incomplete cohort fails closed.
- Post-hoc checks cannot restore freshness to an exposed cohort.
- P1 is terminally rejected: its scientific invalid-output gate failed, and it lacks the newer pre-freeze atomic reservation and separate frame receipt.
- `candidates/stage2_native_owned_v1.csv` remains a validated, unsubmitted research candidate with a technically complete raw-input package, but it is not finalist-ready while release licensing is unresolved.
- The offline raw-organizer-input sensor-to-feature-to-CSV path, eight adversarial package tests, and two clean byte-identical replays all pass. Finalist release still requires participant Apache-2.0 approval and confirmation of organizer-only delivery terms for derived model files.
- No public leaderboard movement authorizes row-level probing or threshold, prompt, or cohort tuning.

The enforced Large reservation entry point is `scripts/reserve_vlm_fresh_cohort.py`. The independent decisions are recorded in `reports/p1_independent_control_audit_v1.json` and `reports/stage2_owned_package_control_audit_v1.json`.
