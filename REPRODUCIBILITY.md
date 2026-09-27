# Reproducibility guide

This archive supports source review and lightweight checks. It does not claim
that a public clone can reproduce a competition run without separately
authorized inputs and artifacts.

## Source-level checks

The Large track keeps source in `large/scripts/` and tests in `large/tests/`.
Inspect the pinned dependencies in `large/requirements-repro.txt` before
running an individual test. The Small track keeps its source and boundary
harness in `small/src/`.

Neither track includes a supported command that downloads competition data,
writes a submission, or restores a model artifact. Any local use must acquire
the official input independently, comply with the governing terms, and keep
inputs outside version control.

## Evidence interpretation

The reports preserve detailed derived metrics, protocol conditions, code
hashes, model identifiers, and gate results. They deliberately omit
record-selection vectors and raw-input mappings, so they are evidence of the
recorded experiment rather than a redistributable reconstruction package.

Read [DATA_SOURCES.md](DATA_SOURCES.md), [UPSTREAMS.md](UPSTREAMS.md), and
[NOTICE.md](NOTICE.md) before extending the work.
