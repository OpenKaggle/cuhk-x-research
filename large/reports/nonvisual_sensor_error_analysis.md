# Nonvisual sensor error analysis

Validation contract: 18-fold leave-one-subject-out, with every clip kept intact.

| Slice | Parent | Expert | Expert-only wins | Parent-only wins | Worst user delta |
|---|---:|---:|---:|---:|---:|
| HARn/object_interaction | 0.8496 | 0.8496 | 14 | 14 | -0.4444 |
| HARn/single | 0.4336 | 0.7669 | 184 | 41 | +0.0667 |
| HAU/emotion | 0.3201 | 0.4487 | 171 | 67 | +0.0196 |
| HAU/single | 0.8912 | 0.6811 | 44 | 214 | -0.3095 |

## Decision implications

- HARn single is a genuine sensor recovery slice: use conservative high-confidence overrides.
- HAU emotion improves on average, but margins are small; require feature/seed stability before submission.
- HAU single is dominated by the structural parent; broad overrides are rejected.
- HARn object interaction ties overall and loses on its worst subject; only independently gated sparse changes qualify.
- Fifty-eight declared IMU units contain header-only CSVs; missing-signal rows must abstain.
- A public tie after one changed test row is non-diagnostic and must not be used as a hidden-label oracle.
