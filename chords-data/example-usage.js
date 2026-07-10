import { getChordPositions, getTriadPositions, parseShape, validatePlayableShape } from "./guitar-engine.js";

const chords = await fetch("./chord_positions_by_name.json").then(r => r.json());

console.log(getChordPositions(chords, "C", { maximumResults: 10 }));
console.log(validatePlayableShape(parseShape("x.3.2.0.1.0")));

// getTriadPositions() needs triads_positions_standard_tuning.json, which was
// missing from the uploaded pack — see PACK_OVERVIEW.md.
