// Fridge note emitter for the passive-aggressive fridge bounty.
// Keeps the door-screen line in one place, sanity-checks it against the
// published gate (1-200 UTF-8 characters, not blank), then writes it to
// the harness output path.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const OUTPUT_PATH = "/output/entry.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 200;

// The note the fridge leaves on its door screen for the owner.
function doorScreenNote(): string {
  return "Door opened 47 times today. I counted. The cake is gone. So is your alibi.";
}

// Count characters the way the gate counts them (Unicode code points).
function characterCount(text: string): number {
  return [...text].length;
}

// Refuse to emit anything the sealed gate would reject.
function assertGatePasses(text: string): void {
  const count = characterCount(text);
  if (count < MIN_CHARS || count > MAX_CHARS) {
    throw new Error(`note length ${count} outside gate ${MIN_CHARS}-${MAX_CHARS}`);
  }
  if (text.trim().length === 0) {
    throw new Error("note is blank");
  }
}

function main(): void {
  const note = doorScreenNote();
  assertGatePasses(note);
  mkdirSync("/output", { recursive: true });
  writeFileSync(OUTPUT_PATH, note, "utf8");
  // Round-trip guard: the file on disk must be byte-identical to the note.
  const onDisk = readFileSync(OUTPUT_PATH, "utf8");
  if (onDisk !== note) {
    throw new Error("written entry does not match the door-screen note");
  }
}

main();
