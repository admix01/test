import {
  getScaleFretboard,
  getScaleNotes,
  groupScaleByString,
} from "../engines/scale-engine.js";

const scales = await fetch("../data/scales.json")
  .then((response) => response.json());

const notes = getScaleNotes(
  scales,
  "A",
  "minorPentatonic",
  "sharp",
);

console.log("Notes de A pentatonique mineure :", notes);

const fretboard = getScaleFretboard(
  scales,
  "A",
  "minorPentatonic",
  {
    minimumFret: 0,
    maximumFret: 24,
  },
);

console.log(
  "Positions regroupées par corde :",
  groupScaleByString(fretboard),
);
