/** Guitar chord utilities. String order: low E -> high E. */
export const STANDARD_TUNING_MIDI = [40, 45, 50, 55, 59, 64];
export const NOTE_NAMES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

export function parseShape(shape) {
  const tokens = String(shape).trim().toLowerCase().split(".");
  if (tokens.length !== 6) throw new Error(`A shape must contain 6 strings: ${shape}`);
  return tokens.map((token) => {
    if (["x", "-", ""].includes(token)) return null;
    const fret = Number(token);
    if (!Number.isInteger(fret) || fret < 0) throw new Error(`Invalid fret: ${token}`);
    return fret;
  });
}

export function shapeToString(frets) {
  if (!Array.isArray(frets) || frets.length !== 6) throw new Error("Six fret values are required");
  return frets.map((fret) => fret === null ? "x" : String(fret)).join(".");
}

export function noteAt(stringIndex, fret, tuning = STANDARD_TUNING_MIDI) {
  const midi = tuning[stringIndex] + fret;
  return { midi, pitchClass: midi % 12, note: NOTE_NAMES[midi % 12] };
}

export function analyzeShape(frets) {
  const sounding = frets.filter((fret) => fret !== null);
  const pressed = sounding.filter((fret) => fret > 0);
  const minPressedFret = pressed.length ? Math.min(...pressed) : 0;
  const maxPressedFret = pressed.length ? Math.max(...pressed) : 0;
  const pressedFretSpan = pressed.length >= 2 ? maxPressedFret - minPressedFret : 0;
  return {
    soundingStrings: sounding.length,
    mutedStrings: frets.filter((fret) => fret === null).length,
    openStrings: frets.filter((fret) => fret === 0).length,
    pressedStrings: pressed.length,
    minPressedFret,
    maxPressedFret,
    pressedFretSpan,
    playableSpan4: pressedFretSpan <= 4,
    openPlusHighPosition: frets.some((fret) => fret === 0) && minPressedFret >= 6,
  };
}

export function validatePlayableShape(frets, options = {}) {
  const { maximumPressedSpan = 4, minimumSoundingStrings = 3, allowOpenPlusHighPosition = false } = options;
  const analysis = analyzeShape(frets);
  const reasons = [];
  if (analysis.soundingStrings < minimumSoundingStrings) reasons.push("not enough sounding strings");
  if (analysis.pressedFretSpan > maximumPressedSpan) reasons.push("pressed-fret span is too large");
  if (analysis.openPlusHighPosition && !allowOpenPlusHighPosition) reasons.push("open strings mixed with a high-neck position");
  return { valid: reasons.length === 0, reasons, analysis };
}

export function getChordPositions(positionsByChord, chordName, options = {}) {
  const { maximumResults = 20, maximumPressedSpan = 4, includeOpenPlusHighPosition = false } = options;
  return (positionsByChord[chordName] ?? [])
    .filter((p) => p.pressed_fret_span <= maximumPressedSpan && (includeOpenPlusHighPosition || !p.open_plus_high_position))
    .slice(0, maximumResults);
}

export function getTriadPositions(triadData, filters = {}) {
  const { root, quality, inversion, strings, maximumFret, includeOpenStrings = true, includeOpenPlusHighPosition = false } = filters;
  return triadData.positions.filter((p) => {
    if (root && !p.root_aliases.includes(root)) return false;
    if (quality && p.quality !== quality) return false;
    if (inversion && p.inversion !== inversion) return false;
    if (strings && p.strings.join("-") !== strings.join("-")) return false;
    if (Number.isInteger(maximumFret) && p.max_fret > maximumFret) return false;
    if (!includeOpenStrings && p.contains_open_string) return false;
    if (!includeOpenPlusHighPosition && p.open_plus_high_position) return false;
    return true;
  });
}
