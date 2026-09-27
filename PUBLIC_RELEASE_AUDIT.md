# Public-release audit

## Policy basis

The official CUHK-X challenge overview states that participants retain their
code and models, while competition data remain the organizer's property. It
prohibits manual test labeling and test-ground-truth use. The archive therefore
publishes participant-authored source and derived evidence broadly, but never
the literal downloaded data, labels, copied packages, or a personal/raw-input
mapping.

## Classification applied

| Class | Treatment |
| --- | --- |
| First-party source, tests, protocols | Retained. Input paths are documentation only; no input is bundled. |
| Derived metrics, validation/replay records, hashes, gates, model/version identifiers | Retained in detail. |
| Record-selection vectors, per-record overrides, direct input-output mappings, local paths, identity/contact fields | Removed from reports or redacted in prose. |
| Official/organizer input, model artifacts, generated submissions, caches | Not published. Official pages are linked. |
| Organizer source and third-party Kaggle notebooks | Not mirrored. Replaced by [UPSTREAMS.md](UPSTREAMS.md). |

## Mechanical projection

`tools/project_public_evidence.mjs` records the repeatable projection used for
the JSON evidence and receipts. It removes explicitly named selection-vector
fields and redacts local paths, email addresses, and participant-index literals
while preserving the remaining structured evidence.

## Residual caveat

Publication of a method, metric, hash, or validation result does not establish
permission to obtain the data, use a model, reproduce a competition entry, or
release a trained artifact. Consult the official source and its current terms.
