/**
 * Moteur de gammes pour data/scales.json
 *
 * Ordre de l'accordage :
 * [corde 6, corde 5, corde 4, corde 3, corde 2, corde 1]
 * de la plus grave vers la plus aiguë.
 */

export const STANDARD_TUNING_MIDI = [40, 45, 50, 55, 59, 64];

export const NOTE_NAMES_SHARP = [
  "C", "C#", "D", "D#", "E", "F",
  "F#", "G", "G#", "A", "A#", "B",
];

export const NOTE_NAMES_FLAT = [
  "C", "Db", "D", "Eb", "E", "F",
  "Gb", "G", "Ab", "A", "Bb", "B",
];

export function normalizePitchClass(value) {
  return ((value % 12) + 12) % 12;
}

export function getRootPitchClass(root) {
  const aliases = {
    C: 0,
    "B#": 0,
    "C#": 1,
    Db: 1,
    D: 2,
    "D#": 3,
    Eb: 3,
    E: 4,
    Fb: 4,
    "E#": 5,
    F: 5,
    "F#": 6,
    Gb: 6,
    G: 7,
    "G#": 8,
    Ab: 8,
    A: 9,
    "A#": 10,
    Bb: 10,
    B: 11,
    Cb: 11,
  };

  if (!(root in aliases)) {
    throw new Error(`Fondamentale inconnue : ${root}`);
  }

  return aliases[root];
}

export function getScaleDefinition(scaleDatabase, scaleId) {
  const scale = scaleDatabase.scales?.[scaleId];

  if (!scale) {
    throw new Error(`Gamme inconnue : ${scaleId}`);
  }

  return scale;
}

export function getScalePitchClasses(scaleDatabase, root, scaleId) {
  const rootPitchClass = getRootPitchClass(root);
  const scale = getScaleDefinition(scaleDatabase, scaleId);

  return scale.intervals.map((interval, degreeIndex) => ({
    pitchClass: normalizePitchClass(rootPitchClass + interval),
    interval,
    degreeLabel: scale.degreeLabels[degreeIndex],
    degreeIndex,
    isRoot: interval === 0,
  }));
}

export function getScaleNotes(
  scaleDatabase,
  root,
  scaleId,
  notePreference = "sharp",
) {
  const names = notePreference === "flat"
    ? NOTE_NAMES_FLAT
    : NOTE_NAMES_SHARP;

  return getScalePitchClasses(scaleDatabase, root, scaleId).map((degree) => ({
    ...degree,
    note: names[degree.pitchClass],
  }));
}

export function getScaleFretboard(
  scaleDatabase,
  root,
  scaleId,
  options = {},
) {
  const {
    tuning = STANDARD_TUNING_MIDI,
    minimumFret = 0,
    maximumFret = 24,
    notePreference = "sharp",
  } = options;

  const names = notePreference === "flat"
    ? NOTE_NAMES_FLAT
    : NOTE_NAMES_SHARP;

  const degrees = getScalePitchClasses(scaleDatabase, root, scaleId);
  const byPitchClass = new Map(
    degrees.map((degree) => [degree.pitchClass, degree]),
  );

  const positions = [];

  tuning.forEach((openStringMidi, stringIndex) => {
    for (let fret = minimumFret; fret <= maximumFret; fret += 1) {
      const midi = openStringMidi + fret;
      const pitchClass = normalizePitchClass(midi);
      const degree = byPitchClass.get(pitchClass);

      if (!degree) continue;

      positions.push({
        string: 6 - stringIndex,
        stringIndex,
        fret,
        midi,
        pitchClass,
        note: names[pitchClass],
        degreeIndex: degree.degreeIndex,
        interval: degree.degreeLabel,
        semitonesFromRoot: degree.interval,
        isRoot: degree.isRoot,
      });
    }
  });

  return positions;
}

export function groupScaleByString(positions) {
  return positions.reduce((groups, position) => {
    const key = String(position.string);
    if (!groups[key]) groups[key] = [];
    groups[key].push(position);
    return groups;
  }, {});
}

export function getScaleNames(scaleDatabase) {
  return Object.entries(scaleDatabase.scales ?? {})
    .map(([id, scale]) => ({
      id,
      name: scale.name,
      shortName: scale.shortName,
      family: scale.family,
      aliases: scale.aliases ?? [],
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

export function getScalesByFamily(scaleDatabase) {
  return getScaleNames(scaleDatabase).reduce((groups, scale) => {
    if (!groups[scale.family]) groups[scale.family] = [];
    groups[scale.family].push(scale);
    return groups;
  }, {});
}

export function filterScalePosition(
  positions,
  minimumFret,
  maximumFret,
) {
  return positions.filter(
    (position) =>
      position.fret >= minimumFret
      && position.fret <= maximumFret,
  );
}
