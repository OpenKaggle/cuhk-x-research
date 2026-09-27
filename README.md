# CUHK-X research archive

An OpenKaggle source-and-evidence archive for reproducible work around the
CUHK-X Large Model and Small Model tracks. It keeps the parts that make a
research project useful to another practitioner: first-party code, test
harnesses, experiment protocols, detailed metrics, hashes, and gate outcomes.

It intentionally does **not** mirror the competition packages, any private
participant material, trained weights, submission CSVs, caches, credentials,
or third-party source trees.

## Start here

- [Release manifest](RELEASE_MANIFEST.md) explains what is public and why.
- [Public-release audit](PUBLIC_RELEASE_AUDIT.md) records the exact treatment
  of source, derived evidence, upstream references, and restricted material.
- [Data sources](DATA_SOURCES.md) links to the official competition pages and
  describes the acquisition boundary.
- [Upstreams](UPSTREAMS.md) replaces copied organizer code and Kaggle notebooks
  with their original homes and licensing context.
- [Reproducibility guide](REPRODUCIBILITY.md) explains the supported
  source-level checks without implying access to excluded inputs.

`large/` contains the multimodal VQA research source and evidence; `small/`
contains the lightweight HAR research source and evidence. Both directories
retain detailed, sanitised research records. Record-selection vectors,
participant identities, local paths, and raw-input mappings have been removed
from those records; metric tables, methods, code hashes, gate decisions,
versions, and reproducibility checks remain.

## License boundary

The root [MIT License](LICENSE) covers only original OpenKaggle material for
which contributors hold rights. Competition data remain the organizer's
property and are not included. See [NOTICE.md](NOTICE.md) before reusing any
method together with a data source, model, or upstream project.
