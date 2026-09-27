#!/usr/bin/env node
/**
 * Projects the private working record into a public source-and-evidence archive.
 * It intentionally retains method, protocol, metric, hash, and gate evidence,
 * while removing record-selection vectors, local paths, and personal contact data.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const exactRestrictedKeys = new Set([
  "all_consensus_overrides",
  "by_subject",
  "by_user_net",
  "by_user",
  "changed_rows",
  "clips",
  "cohort",
  "consensus_override_qa_ids",
  "consensus_test_overrides",
  "exact8_by_subject_half",
  "exact8_object_subjects",
  "excluded_qa_ids",
  "fixed_odd_even_subject_cohorts",
  "frozen_rows",
  "multi_test_overrides",
  "multi_test_rows",
  "new_rows",
  "overrides",
  "selected_clips",
  "selected_qa_ids",
  "selected_rows",
  "selection_file",
  "selection_sha256",
  "subject_distribution",
  "subject_half_distribution",
  "subjects",
  "training_qa_ids",
  "historical_training_qa_ids",
]);

function redactPrivateIdentities(value) {
  let projected = String(value);
  const privateIdentities = (process.env.OPENKAGGLE_PRIVATE_IDENTITIES || "")
    .split(",")
    .map((identity) => identity.trim())
    .filter(Boolean);
  for (const identity of privateIdentities) {
    const escaped = identity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    projected = projected.replace(new RegExp(escaped, "gi"), "[participant]");
  }
  return projected;
}

function redactText(value) {
  const projected = String(value)
    .replace(/\/(?:Users|home|private|var|tmp)\/[^\s"'`]+/g, "[local-path]")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]")
    .replace(/\b(?:user|subject)[ _-]?\d+\b/gi, "[participant-index]")
    .replace(/\b(?:qa[_ -]?id|clip)[ _:-]?\d+\b/gi, "[record-id]");
  return redactPrivateIdentities(projected);
}

function project(value, key = "") {
  if (exactRestrictedKeys.has(key)) return undefined;
  if (key === "resolved_local_path") return undefined;
  if (Array.isArray(value)) {
    return value.map((item) => project(item, key)).filter((item) => item !== undefined);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .map(([childKey, childValue]) => [childKey, project(childValue, childKey)])
        .filter(([, childValue]) => childValue !== undefined),
    );
  }
  return typeof value === "string" ? redactText(value) : value;
}

function walk(dir, predicate) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(file, predicate);
    return predicate(file) ? [file] : [];
  });
}

for (const relativeDir of ["large/reports", "small/config", "small/receipts"]) {
  for (const file of walk(path.join(root, relativeDir), (candidate) => candidate.endsWith(".json"))) {
    const document = JSON.parse(fs.readFileSync(file, "utf8"));
    fs.writeFileSync(file, `${JSON.stringify(project(document), null, 2)}\n`);
  }
}

for (const relativeDir of ["large/official_receipts", "large/reports", "small/receipts"]) {
  for (const file of walk(path.join(root, relativeDir), (candidate) => candidate.endsWith(".md"))) {
    fs.writeFileSync(file, redactText(fs.readFileSync(file, "utf8")));
  }
}

for (const relativeFile of ["NOTICE.md", "large/README.md", "large/TECHNICAL_REPORT.md", "small/README.md"]) {
  const file = path.join(root, relativeFile);
  if (fs.existsSync(file)) fs.writeFileSync(file, redactText(fs.readFileSync(file, "utf8")));
}

const sourceExtensions = new Set([".cff", ".py", ".sh", ".txt", ".yaml", ".yml"]);
for (const file of walk(root, (candidate) => sourceExtensions.has(path.extname(candidate)))) {
  fs.writeFileSync(file, redactPrivateIdentities(fs.readFileSync(file, "utf8")));
}
