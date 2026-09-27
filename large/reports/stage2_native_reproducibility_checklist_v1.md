# Stage2-native reproducibility checklist v1

Snapshot: 2026-09-11 12:56 CST

## Identity and compliance

- [x] Kaggle team is exactly `[participant]`.
- [x] Official CUHK-X registration confirmed for Large + Small, solo team, `Stiftung Louisenlund`, `Germany`, no advisor.
- [x] No test labels, manual test annotation, row-level leaderboard probe, or third-party fixed 682-row vector used by the owned route.
- [x] Qwen checkpoint identity, revision, license, and all 16 local files are hashed.
- [x] No Kaggle submission was attempted for the owned route or either rejected VLM branch.

## Frozen inputs

- [x] `training_qa.csv`: `2509ed00f9305d552378618d8987559bdff7a4b56241c630ba99dc4051f535bc`
- [x] `test_qa.csv`: `d694c7abc5a003d5c9048098880f0f77716fae0eb18d1c9fe9330e4e987320a5`
- [x] `sample_submission.csv`: `456905af98ce5257042f3779982e5b48e0ea248fcdf38eb79c9dd3e4f88a0a38`
- [x] Nonvisual feature cache: `a8ed7d5925977dabd18b4b55a2beecb02a8a7435ce0773268a41d188cefdd661`
- [x] Complete HARn visual manifest: `e31e3b7c6f3799f8dd179e01577409ae45721b06d33e37c6f80b8366534021e2`
- [x] Complete test visual manifest: `041d7163fd3225509206b9fe722b592cc7f1d9b73a3a6da419b73ef47d7447c3`

## Honest OOF

- [x] Protocol frozen before full owned OOF: `reports/stage2_native_v1_preregistered_protocol.json`.
- [x] 18 leave-one-subject-out folds; 4,087 rows; 1,333 clips kept intact.
- [x] Owned semantic base is self-contained and reads no public predictions.
- [x] Full system accuracy `0.621972`; base `0.563249`; net `+240` / `+5.8723pp`.
- [x] Subject halves `+127/+113`; worst subject net `+4`.
- [x] HARn single `0.785548`; HAU emotion consensus disagreement slice `117/186` versus base `26/186`.
- [x] 24 option permutations × 4,087 rows = 98,088 checks; zero mismatch.
- [x] Invalid predictions: zero.
- [x] OOF SHA-256: `8cf9879a1e147456db67dffe3246bb108e2816170dc787347ce24e93a8f7d1b7`.

Reproduce:

```bash
../.venv/bin/python scripts/run_stage2_native_oof_v1.py
```

## Visual gates and exposure control

- [x] All-missing-skeleton Qwen cohort fixed label-independently at 40 rows.
- [x] Qwen fallback rejected: accuracy `0.45`, valid rate `0.975`, halves `0.357/0.50`; no test inference.
- [x] P1 fresh48 excluded the complete frozen QA/clip exposure union before inference.
- [x] P1 rejected because invalid counts were 28 generic and 1 decomposed/schema; no test inference.
- [x] Independent P1 control audit records that no atomic reservation or separate minimum-frame receipt existed before freeze; the exposed cohort is terminal and cannot be retroactively qualified.
- [x] All 40 + 48 newly exposed rows appended to `artifacts/manifests/vlm_exposure_registry.jsonl`.
- [x] Future fresh screens must use `scripts/reserve_vlm_fresh_cohort.py` for label-blind readability/minimum-frame checks and an atomic locked reservation after rechecking both registries, all VLM JSONL logs, and all frozen manifests by QA ID and clip path.
- [x] Independent P1 metric recomputation matches the terminal report: routed `33/48` versus `12/48`, action `+3`, object `+18`, halves `+11/+10`, subject macro `+0.37778`, worst-subject delta `0.0`.
- [x] P1 remains rejected because invalid counts are `28/48` generic and `1/48` decomposed, one decomposed schema is invalid, and the protocol did not preregister the runner hash; no candidate or submission was created.
- [x] Registry v2 contains a complete final-hash record for all 48 P1 QA/clip pairs and shows zero QA/clip overlap with earlier inference logs.
- [x] Label-blind P2 video readiness ran before cohort freeze: 218 unexposed rows / 214 clips are readable and hash-matched; 206 rows meet `total_frames >= 8`; 12 short rows are excluded before selection.
- [ ] Review and freeze a separately named P2 protocol only if more fresh evidence is worth consuming; require answer-first output, exact eight-frame indices, scarce-object coverage, subject halves, duration strata, atomic registry reservation, and a preregistered runner hash.

## Network-free candidate replay

- [x] Core OOF gate passed before test QA was read by the builder.
- [x] Qwen rejection enforced; visual predictions have zero deployment effect.
- [x] Each build installs a socket-level network block before model loading/inference.
- [x] Run 1 and run 2 are byte-identical.
- [x] 682 unique QA IDs, official order, 208 clips, zero invalids.
- [x] Source counts: semantic base 559; HARn skeleton RF 41; HAU emotion ET–RF consensus 82.
- [x] Final owned candidate SHA-256: `40361ab2b6a87d5b73da3114aada27b982b37c09d205864ec8ed272701ae06b8`.
- [x] `scripts/validate_submission.py` passes.
- [x] Generic builder accepts arbitrary input-QA and feature-cache paths instead of requiring known QA IDs or `LM_test_*` clip keys.
- [x] Six-row/two-clip smoke replaced every QA ID and clip key; predictions were identical by row, both runs were network-blocked, and invalids were zero.

Reproduce twice:

```bash
../.venv/bin/python scripts/build_stage2_native_candidate_v1.py \
  --output artifacts/dry_runs/stage2_native_v1_run1.csv \
  --report reports/stage2_native_v1_run1.json
../.venv/bin/python scripts/build_stage2_native_candidate_v1.py \
  --output artifacts/dry_runs/stage2_native_v1_run2.csv \
  --report reports/stage2_native_v1_run2.json
cmp -s artifacts/dry_runs/stage2_native_v1_run1.csv artifacts/dry_runs/stage2_native_v1_run2.csv
../.venv/bin/python scripts/validate_submission.py candidates/stage2_native_owned_v1.csv
```

## Remaining before finalist delivery

- [x] Record the package-control boundary: the owned CSV is a validated research candidate, but current `inference.sh` does not call it and a new clip requires a precomputed feature cache.
- [x] Package raw organizer sensor discovery and extraction, then add the owned route to the separate `inference_owned.sh` fail-closed entry point; legacy `inference.sh` is unchanged.
- [x] Test missing declared files, missing manifest-declared units, corrupt JSON, short skeleton streams, extra files, reordered QA/manifest rows, unlisted clips without explicit authorization, and arbitrary renamed QA/clip IDs without network access: 8/8 pass.
- [x] Run two clean raw-input-to-CSV replays: feature caches and 682-row candidates are byte-identical; candidate SHA remains `40361ab2...06b8`.
- [x] Freeze the technical model/data/code inventory in `reports/stage2_native_owned_raw_package_v1.json`, the release boundary in `reports/stage2_native_owned_release_manifest_v1.json`, and the v9 reproducibility manifest.
- [x] Resolve the operational deadline and model-scope controls: enforce the conservative package deadline `2026-09-17 15:55 UTC` and keep Small no-LLM final inference separate from development-assistant permission.
- [ ] Obtain explicit participant approval to publish the clean-room source subset under Apache-2.0 and confirm organizer-only delivery terms for participant-trained model files derived from non-redistributable data.
- [ ] Perform quota and candidate-diversity review before any sparse whole-mechanism Kaggle submission.
- [ ] Never use public score movement to tune individual rows, thresholds, prompts, or cohort membership.
