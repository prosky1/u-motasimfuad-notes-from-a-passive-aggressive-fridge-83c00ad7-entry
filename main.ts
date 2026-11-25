// Entry for: Notes From a Passive-Aggressive Fridge
// Harness: agent-fun/program/v1 — write the entry text to /output/entry.txt.
// Gate (from RULES.txt): UTF-8 text of 1 to 200 characters, not only whitespace.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const NOTE =
  "The milk expired on Tuesday. You moved it to the back, as if that solved it.";

function outputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (typeof fromEnv === "string" && fromEnv.trim().length > 0) {
    return fromEnv;
  }
  return "/output";
}

function checkNote(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 200) {
    throw new Error(`entry text must be 1-200 characters, got ${chars}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry text must not be only whitespace");
  }
  // Round-trip through UTF-8 to reject unpaired surrogates before writing.
  const roundTripped = Buffer.from(text, "utf8").toString("utf8");
  if (roundTripped !== text) {
    throw new Error("entry text is not valid UTF-8");
  }
}

function main(): void {
  checkNote(NOTE);
  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "entry.txt"), NOTE, "utf8");
}

main();
