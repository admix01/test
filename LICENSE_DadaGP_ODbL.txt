/**
 * Moteur de recherche pour data/triads.json
 */

function sameStringSet(positionStrings, requestedStrings) {
  if (!requestedStrings) return true;
  return positionStrings.join("-") === requestedStrings.join("-");
}

export function getTriadPositions(triadDatabase, filters = {}) {
  const {
    root,
    quality,
    inversion,
    strings,
    minimumFret = 0,
    maximumFret = 24,
    includeOpenStrings = true,
    maximumPressedSpan = 4,
  } = filters;

  const positions = triadDatabase.positions ?? [];

  return positions
    .filter((position) => {
      if (root && !position.root_aliases.includes(root)) return false;
      if (quality && position.quality !== quality) return false;
      if (inversion && position.inversion !== inversion) return false;
      if (!sameStringSet(position.strings, strings)) return false;
      if (position.min_fret < minimumFret) return false;
      if (position.max_fret > maximumFret) return false;
      if (
        !includeOpenStrings
        && position.contains_open_string
      ) return false;
      if (position.pressed_fret_span > maximumPressedSpan) return false;
      return true;
    })
    .sort((a, b) =>
      a.min_fret - b.min_fret
      || a.inversion_number - b.inversion_number
      || a.max_fret - b.max_fret
    );
}

export function groupTriadsByStrings(positions) {
  return positions.reduce((groups, position) => {
    const key = position.strings.join("-");
    if (!groups[key]) groups[key] = [];
    groups[key].push(position);
    return groups;
  }, {});
}

export function groupTriadsByInversion(positions) {
  return positions.reduce((groups, position) => {
    const key = position.inversion;
    if (!groups[key]) groups[key] = [];
    groups[key].push(position);
    return groups;
  }, {
    root: [],
    first: [],
    second: [],
  });
}

export function getTriadNeckZone(position) {
  if (position.max_fret <= 5) return "low";
  if (position.min_fret <= 12) return "middle";
  return "high";
}

export function getTriadSequence(
  triadDatabase,
  root,
  quality,
  strings,
  maximumFret = 15,
) {
  return getTriadPositions(triadDatabase, {
    root,
    quality,
    strings,
    maximumFret,
  }).sort((a, b) =>
    a.min_fret - b.min_fret
    || a.inversion_number - b.inversion_number
  );
}
