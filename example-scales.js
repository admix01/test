/**
 * Moteur de recherche pour data/chords.json
 * Ordre des cordes : [6, 5, 4, 3, 2, 1], de la plus grave à la plus aiguë.
 */

export function getChordNames(chordDatabase) {
  return Object.keys(chordDatabase).sort((a, b) =>
    a.localeCompare(b, "fr", { sensitivity: "base" })
  );
}

export function getChordPositions(chordDatabase, chordName, options = {}) {
  const {
    maximumResults = 20,
    maximumFret = 24,
    maximumPressedSpan = 4,
    openOnly = false,
    excludeOpenStrings = false,
    minimumSoundingStrings = 2,
    sortBy = "usage",
  } = options;

  const positions = [...(chordDatabase[chordName] ?? [])];

  const filtered = positions.filter((position) => {
    if ((position.sounding_strings ?? 0) < minimumSoundingStrings) return false;
    if ((position.max_pressed_fret ?? 0) > maximumFret) return false;
    if ((position.pressed_fret_span ?? 0) > maximumPressedSpan) return false;
    if (openOnly && (position.open_strings ?? 0) === 0) return false;
    if (excludeOpenStrings && (position.open_strings ?? 0) > 0) return false;
    return true;
  });

  filtered.sort((a, b) => {
    if (sortBy === "neck") {
      return (
        (a.min_pressed_fret ?? 0) - (b.min_pressed_fret ?? 0)
        || (a.max_pressed_fret ?? 0) - (b.max_pressed_fret ?? 0)
        || (b.usage_count ?? 0) - (a.usage_count ?? 0)
      );
    }

    if (sortBy === "easy") {
      return (
        (a.pressed_fret_span ?? 0) - (b.pressed_fret_span ?? 0)
        || (a.max_pressed_fret ?? 0) - (b.max_pressed_fret ?? 0)
        || (b.open_strings ?? 0) - (a.open_strings ?? 0)
        || (b.usage_count ?? 0) - (a.usage_count ?? 0)
      );
    }

    return (
      (b.usage_count ?? 0) - (a.usage_count ?? 0)
      || (a.usage_rank ?? 9999) - (b.usage_rank ?? 9999)
    );
  });

  return filtered.slice(0, maximumResults);
}

export function getNeckZone(position) {
  const minimum = position.min_pressed_fret ?? 0;
  const maximum = position.max_pressed_fret ?? 0;

  if (maximum <= 5) return "low";
  if (minimum <= 12) return "middle";
  return "high";
}

export function shapeToDisplay(shape) {
  return String(shape).split(".").map((value, index) => ({
    string: 6 - index,
    fret: value.toLowerCase() === "x" ? null : Number(value),
    muted: value.toLowerCase() === "x",
    open: value === "0",
  }));
}
