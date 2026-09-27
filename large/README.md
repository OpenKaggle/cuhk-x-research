# CUHK-X Large Model Track research

This directory preserves first-party research source and detailed,
participant-authored evidence for multimodal VQA experiments. The retained
records include experimental designs, runtime and model settings, metrics,
hashes, reproducibility gates, and decision outcomes.

## What is here

- `scripts/` — first-party extraction, validation, experiment, and replay
  utilities. They expect separately authorized local inputs and do not bundle
  or fetch them.
- `tests/` — source-level tests for selected protocol and gate logic.
- `reports/` — sanitised detailed evidence. Metrics, method descriptions,
  version identifiers, run status, and hashes are retained; vectors that select
  individual competition records or map records to candidate outputs are not.
- `official_receipts/` — lightweight public-outcome and process notes with
  participant identity and local-path references redacted.
- `TECHNICAL_REPORT.md` and `VLM_EXPOSURE_GOVERNANCE_V2.md` — research
  narrative and control-plane documentation, interpreted alongside the public
  release boundary.

## Not included

Competition inputs, extracted media, copied Kaggle metadata, weights, feature
caches, candidate submission files, and notebook mirrors are excluded. Use
[the root data-source guide](../DATA_SOURCES.md) and
[upstream index](../UPSTREAMS.md) for official locations.

## Reuse

The methods and source are published for review and extension under the root
license boundary. You must separately establish permission for every dataset,
model, and upstream dependency before running an experiment.
