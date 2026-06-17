// Chord Database and Guitar Fretboard Geometry

// Chromatic scale starting at C
export const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Map to normalize flat notes to sharps
export const ENHARMONIC_MAP = {
  'Db': 'C#',
  'Eb': 'D#',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#',
  'Cb': 'B',
  'Fb': 'E'
};

// Map to display nice labels (e.g. Eb instead of D# depending on context)
export const DISPLAY_NAME_MAP = {
  'C#': 'C# / Db',
  'D#': 'D# / Eb',
  'F#': 'F# / Gb',
  'G#': 'G# / Ab',
  'A#': 'A# / Bb'
};

// Open string MIDI values (6th to 1st string: E2, A2, D3, G3, B3, E4)
export const OPEN_STRING_MIDI = [40, 45, 50, 55, 59, 64];
export const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'E'];

// Map the User-selected (Quality, Extension) to internal Chord Flavor names
export function getChordFlavor(quality, extension) {
  if (quality === 'Major') {
    if (extension === 'normal') return 'Major';
    if (extension === '6') return 'Major 6';
    if (extension === '7') return 'Major 7';
    if (extension === '9') return 'Major 9';
    if (extension === '13') return 'Major 13';
    if (extension === 'b5') return 'Major b5';
    if (extension === 'b9') return 'Major b9';
    if (extension === '#9') return 'Major #9';
    if (extension === '#5') return 'Augmented';
  }
  if (quality === 'Minor') {
    if (extension === 'normal') return 'Minor';
    if (extension === '6') return 'Minor 6';
    if (extension === '7') return 'Minor 7';
    if (extension === '9') return 'Minor 9';
    if (extension === '13') return 'Minor 13';
    if (extension === 'b5') return 'Diminished';
    if (extension === 'b9') return 'Minor b9';
    if (extension === '#9') return 'Minor #9';
    if (extension === '#5') return 'Minor #5';
  }
  if (quality === 'Dominant') {
    if (extension === 'normal' || extension === '6' || extension === '7') return 'Dominant 7';
    if (extension === '9') return 'Dominant 9';
    if (extension === '13') return 'Dominant 13';
    if (extension === 'b5') return 'Dominant 7b5';
    if (extension === 'b9') return 'Dominant 7b9';
    if (extension === '#9') return 'Dominant 7#9';
    if (extension === '#5') return 'Dominant 7#5';
  }
  if (quality === 'Diminished') {
    if (extension === 'normal' || extension === '6') return 'Diminished';
    if (extension === '7' || extension === '13') return 'Diminished 7';
    if (extension === '9') return 'Diminished 9';
    if (extension === 'b5') return 'Diminished';
    if (extension === 'b9') return 'Diminished b9';
    if (extension === '#9' || extension === '#5') return 'Diminished 7';
  }
  if (quality === 'Augmented') {
    if (extension === 'normal' || extension === '#5') return 'Augmented';
    if (extension === '6') return 'Augmented 6';
    if (extension === '7') return 'Augmented 7';
    if (extension === '9') return 'Augmented 9';
    if (extension === '13') return 'Augmented 13';
    if (extension === 'b5') return 'Augmented b5';
    if (extension === 'b9') return 'Augmented 7b9';
    if (extension === '#9') return 'Augmented 7#9';
  }
  return 'Major';
}

// Open chord definitions for specific notes and flavors
// 'x' indicates muted strings
const OPEN_CHORDS = {
  'C': {
    'Major': { frets: ['x', 3, 2, 0, 1, 0], fingers: ['x', 3, 2, 0, 1, 0] },
    'Major 7': { frets: ['x', 3, 2, 0, 0, 0], fingers: ['x', 3, 2, 0, 0, 0] },
    'Major 9': { frets: ['x', 3, 2, 4, 3, 0], fingers: ['x', 2, 1, 4, 3, 0] },
    'Dominant 7': { frets: ['x', 3, 2, 3, 1, 0], fingers: ['x', 3, 2, 4, 1, 0] }
  },
  'A': {
    'Major': { frets: ['x', 0, 2, 2, 2, 0], fingers: ['x', 0, 1, 2, 3, 0] },
    'Minor': { frets: ['x', 0, 2, 2, 1, 0], fingers: ['x', 0, 2, 3, 1, 0] },
    'Minor 7': { frets: ['x', 0, 2, 0, 1, 0], fingers: ['x', 0, 2, 0, 1, 0] },
    'Major 7': { frets: ['x', 0, 2, 1, 2, 0], fingers: ['x', 0, 2, 1, 3, 0] },
    'Dominant 7': { frets: ['x', 0, 2, 0, 2, 0], fingers: ['x', 0, 1, 0, 2, 0] }
  },
  'G': {
    'Major': { frets: [3, 2, 0, 0, 0, 3], fingers: [3, 2, 0, 0, 0, 4] },
    'Major 6': { frets: [3, 2, 0, 0, 0, 0], fingers: [3, 2, 0, 0, 0, 0] },
    'Dominant 7': { frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1] }
  },
  'E': {
    'Major': { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
    'Minor': { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
    'Minor 7': { frets: [0, 2, 0, 0, 0, 0], fingers: [0, 2, 0, 0, 0, 0] },
    'Major 7': { frets: [0, 2, 1, 1, 0, 0], fingers: [0, 3, 1, 2, 0, 0] },
    'Dominant 7': { frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0] }
  },
  'D': {
    'Major': { frets: ['x', 'x', 0, 2, 3, 2], fingers: ['x', 'x', 0, 1, 3, 2] },
    'Minor': { frets: ['x', 'x', 0, 2, 3, 1], fingers: ['x', 'x', 0, 2, 3, 1] },
    'Minor 7': { frets: ['x', 'x', 0, 2, 1, 1], fingers: ['x', 'x', 0, 2, 1, 1] },
    'Major 7': { frets: ['x', 'x', 0, 2, 2, 2], fingers: ['x', 'x', 0, 1, 1, 1] },
    'Dominant 7': { frets: ['x', 'x', 0, 2, 1, 2], fingers: ['x', 'x', 0, 2, 1, 3] }
  }
};

// Movable chord shapes database containing 5 shapes for each flavor
// 'x' represents muted strings, while negative integers like -1, -3 represent fret offsets relative to the root
const MOVABLE_SHAPES = {
  'Major': [
    { name: 'E-Shape Barre (Root 6)', rootString: 5, frets: [0, 2, 2, 1, 0, 0], fingers: [1, 3, 4, 2, 1, 1] },
    { name: 'A-Shape Barre (Root 5)', rootString: 4, frets: ['x', 0, 2, 2, 2, 0], fingers: ['x', 1, 3, 3, 3, 1] },
    { name: 'CAGED C-Shape (Root 5)', rootString: 4, frets: ['x', 0, -1, -3, -2, -3], fingers: ['x', 4, 3, 1, 2, 1] },
    { name: 'CAGED D-Shape (Root 4)', rootString: 3, frets: ['x', 'x', 0, 2, 3, 2], fingers: ['x', 'x', 1, 2, 4, 3] },
    { name: 'CAGED G-Shape (Root 6)', rootString: 5, frets: [0, -1, -3, -3, -3, 0], fingers: [4, 3, 1, 1, 1, 4] }
  ],
  'Major 6': [
    { name: 'Barre Shape (Root 6)', rootString: 5, frets: [0, 2, 2, 1, 2, 0], fingers: [1, 3, 4, 2, 4, 1] },
    { name: 'Barre Shape (Root 5)', rootString: 4, frets: ['x', 0, 2, 2, 2, 2], fingers: ['x', 1, 3, 3, 3, 3] },
    { name: 'Jazz Shell (Root 6)', rootString: 5, frets: [0, 'x', 2, 1, 2, 'x'], fingers: [1, 'x', 3, 2, 4, 'x'] },
    { name: 'Jazz Shell (Root 5)', rootString: 4, frets: ['x', 0, 2, -1, 2, 0], fingers: ['x', 1, 3, 1, 4, 1] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 'x', 0, 2, 0, 2], fingers: ['x', 'x', 1, 3, 1, 4] }
  ],
  'Major 7': [
    { name: 'Barre Shape (Root 6)', rootString: 5, frets: [0, 2, 1, 1, 0, 0], fingers: [1, 3, 2, 2, 1, 1] },
    { name: 'Barre Shape (Root 5)', rootString: 4, frets: ['x', 0, 2, 1, 2, 0], fingers: ['x', 1, 3, 2, 4, 1] },
    { name: 'Jazz Shell (Root 6)', rootString: 5, frets: [0, 'x', 1, 1, 0, 'x'], fingers: [1, 'x', 3, 4, 2, 'x'] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 'x', 0, 2, 2, 2], fingers: ['x', 'x', 1, 3, 3, 3] },
    { name: 'CAGED C-Shape (Root 5)', rootString: 4, frets: ['x', 0, -1, -3, -3, -3], fingers: ['x', 4, 3, 1, 1, 1] }
  ],
  'Major 9': [
    { name: 'Jazz Voicing (Root 5)', rootString: 4, frets: ['x', 0, -1, 1, 0, 'x'], fingers: ['x', 2, 1, 3, 1, 'x'] },
    { name: 'Jazz Voicing (Root 6)', rootString: 5, frets: [0, 'x', 1, 1, 0, 2], fingers: [1, 'x', 2, 3, 1, 4] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 'x', 0, 2, 2, 0], fingers: ['x', 'x', 1, 3, 4, 0] },
    { name: 'Movable Shape 2 (Root 5)', rootString: 4, frets: ['x', 0, 2, 1, 0, 0], fingers: ['x', 3, 2, 1, 0, 0] },
    { name: 'Full Voicing (Root 6)', rootString: 5, frets: [0, 2, 1, 1, 0, 2], fingers: [1, 3, 1, 1, 0, 2] }
  ],
  'Major 13': [
    { name: 'Jazz Voicing (Root 6)', rootString: 5, frets: [0, 'x', 1, 1, 2, 2], fingers: [1, 'x', 2, 2, 3, 4] },
    { name: 'Jazz Voicing (Root 5)', rootString: 4, frets: ['x', 0, 2, 1, 2, 2], fingers: ['x', 1, 2, 1, 3, 4] },
    { name: 'Movable (Root 6)', rootString: 5, frets: [0, 2, 1, 1, 2, 0], fingers: [1, 3, 1, 1, 4, 1] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, 2, 1, 2, 2], fingers: ['x', 1, 3, 2, 4, 4] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 'x', 0, 4, 2, 2], fingers: ['x', 'x', 1, 4, 2, 2] }
  ],
  'Minor': [
    { name: 'Barre Shape (Root 6)', rootString: 5, frets: [0, 2, 2, 0, 0, 0], fingers: [1, 3, 4, 1, 1, 1] },
    { name: 'Barre Shape (Root 5)', rootString: 4, frets: ['x', 0, 2, 2, 1, 0], fingers: ['x', 1, 3, 4, 2, 1] },
    { name: 'CAGED C-Shape (Root 5)', rootString: 4, frets: ['x', 0, -2, -3, -2, -4], fingers: ['x', 4, 2, 1, 3, 1] },
    { name: 'CAGED D-Shape (Root 4)', rootString: 3, frets: ['x', 'x', 0, 2, 3, 1], fingers: ['x', 'x', 1, 3, 4, 2] },
    { name: 'CAGED G-Shape (Root 6)', rootString: 5, frets: [0, -2, -3, -3, 0, 0], fingers: [4, 2, 1, 1, 4, 4] }
  ],
  'Minor 6': [
    { name: 'Barre Shape (Root 6)', rootString: 5, frets: [0, 2, 2, 0, 2, 0], fingers: [1, 3, 4, 1, 2, 1] },
    { name: 'Barre Shape (Root 5)', rootString: 4, frets: ['x', 0, 2, 2, 1, 2], fingers: ['x', 1, 3, 4, 2, 4] },
    { name: 'Jazz Shell (Root 6)', rootString: 5, frets: [0, 'x', 2, 0, 2, 'x'], fingers: [1, 'x', 3, 1, 2, 'x'] },
    { name: 'Jazz Shell (Root 5)', rootString: 4, frets: ['x', 0, 2, -1, 1, 2], fingers: ['x', 1, 3, 1, 2, 4] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 'x', 0, 2, 0, 1], fingers: ['x', 'x', 1, 3, 1, 2] }
  ],
  'Minor 7': [
    { name: 'Barre Shape (Root 6)', rootString: 5, frets: [0, 2, 0, 0, 0, 0], fingers: [1, 3, 1, 1, 1, 1] },
    { name: 'Barre Shape (Root 5)', rootString: 4, frets: ['x', 0, 2, 0, 1, 0], fingers: ['x', 1, 3, 1, 2, 1] },
    { name: 'Jazz Shell (Root 6)', rootString: 5, frets: [0, 'x', 0, 0, 0, 'x'], fingers: [1, 'x', 2, 2, 2, 'x'] },
    { name: 'Movable Shape 2 (Root 5)', rootString: 4, frets: ['x', 0, 2, 0, 1, 3], fingers: ['x', 1, 3, 1, 2, 4] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 'x', 0, 2, 1, 1], fingers: ['x', 'x', 1, 3, 2, 2] }
  ],
  'Minor 9': [
    { name: 'Jazz Voicing (Root 5)', rootString: 4, frets: ['x', 0, -2, 0, 0, 'x'], fingers: ['x', 2, 1, 3, 3, 'x'] },
    { name: 'Jazz Voicing (Root 6)', rootString: 5, frets: [0, 2, 0, 0, 0, 2], fingers: [1, 3, 1, 1, 1, 4] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 'x', 0, 2, 1, 0], fingers: ['x', 'x', 1, 3, 2, 0] },
    { name: 'Jazz Shell (Root 6)', rootString: 5, frets: [0, 'x', 0, 0, 0, 2], fingers: [1, 'x', 2, 2, 2, 4] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, 2, 0, 1, 3], fingers: ['x', 1, 3, 1, 2, 4] }
  ],
  'Minor 13': [
    { name: 'Jazz Voicing (Root 6)', rootString: 5, frets: [0, 'x', 0, 0, 2, 2], fingers: [1, 'x', 2, 2, 3, 4] },
    { name: 'Jazz Voicing (Root 5)', rootString: 4, frets: ['x', 0, 2, 0, 1, 2], fingers: ['x', 1, 3, 1, 2, 4] },
    { name: 'Movable (Root 6)', rootString: 5, frets: [0, 2, 0, 0, 2, 0], fingers: [1, 3, 1, 1, 4, 1] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, 2, 0, 1, 2], fingers: ['x', 1, 3, 1, 2, 4] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 'x', 0, 4, 1, 1], fingers: ['x', 'x', 1, 4, 2, 2] }
  ],
  'Dominant 7': [
    { name: 'Barre Shape (Root 6)', rootString: 5, frets: [0, 2, 0, 1, 0, 0], fingers: [1, 3, 1, 2, 1, 1] },
    { name: 'Barre Shape (Root 5)', rootString: 4, frets: ['x', 0, 2, 0, 2, 0], fingers: ['x', 1, 3, 1, 4, 1] },
    { name: 'CAGED G-Shape (Root 6)', rootString: 5, frets: [0, -1, -3, -3, -3, -2], fingers: [3, -1, 1, 1, 1, 2] },
    { name: 'CAGED C-Shape (Root 5)', rootString: 4, frets: ['x', 0, -1, 0, -2, -3], fingers: ['x', 3, 2, 4, 1, 1] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 'x', 0, 2, 1, 2], fingers: ['x', 'x', 1, 3, 2, 4] }
  ],
  'Dominant 9': [
    { name: 'Standard (Root 5)', rootString: 4, frets: ['x', 0, -1, 0, 0, 0], fingers: ['x', 2, 1, 3, 3, 3] },
    { name: 'Standard (Root 6)', rootString: 5, frets: [0, 2, 0, 1, 0, 2], fingers: [1, 3, 1, 2, 1, 4] },
    { name: 'Jazz Shell (Root 6)', rootString: 5, frets: [0, 'x', 0, 1, 0, 2], fingers: [1, 'x', 2, 3, 1, 4] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, 2, 0, 0, -3], fingers: ['x', 1, 3, 1, 1, 2] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 'x', 0, 2, 1, 0], fingers: ['x', 'x', 1, 3, 2, 0] }
  ],
  'Dominant 13': [
    { name: 'Standard (Root 6)', rootString: 5, frets: [0, 'x', 0, 1, 2, 2], fingers: [1, 'x', 2, 3, 4, 4] },
    { name: 'Standard (Root 5)', rootString: 4, frets: ['x', 0, 2, 0, 2, 2], fingers: ['x', 1, 3, 1, 4, 4] },
    { name: 'Movable (Root 6)', rootString: 5, frets: [0, 2, 0, 1, 2, 2], fingers: [1, 3, 1, 2, 4, 4] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, 2, 2, 2, 2], fingers: ['x', 1, 2, 3, 4, 4] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 'x', 0, 2, 1, 2], fingers: ['x', 'x', 1, 3, 2, 4] }
  ],
  'Diminished': [
    { name: 'Standard (Root 6)', rootString: 5, frets: [0, 1, 2, 0, 'x', 'x'], fingers: [1, 2, 3, 1, 'x', 'x'] },
    { name: 'Standard (Root 5)', rootString: 4, frets: ['x', 0, 1, 2, 1, 'x'], fingers: ['x', 1, 2, 4, 3, 'x'] },
    { name: 'Standard (Root 4)', rootString: 3, frets: ['x', 'x', 0, 1, 3, 1], fingers: ['x', 'x', 1, 2, 4, 3] },
    { name: 'Alternative (Root 6)', rootString: 5, frets: [0, 1, 2, 0, -1, 3], fingers: [1, 2, 4, 1, 1, 3] },
    { name: 'Alternative (Root 5)', rootString: 4, frets: ['x', 0, 1, 2, 1, -1], fingers: ['x', 1, 2, 4, 1, 1] }
  ],
  'Diminished 7': [
    { name: 'Standard (Root 6)', rootString: 5, frets: [0, 'x', -1, 0, -1, 'x'], fingers: [2, 'x', 1, 3, 1, 'x'] },
    { name: 'Standard (Root 5)', rootString: 4, frets: ['x', 0, 1, -1, 1, 'x'], fingers: ['x', 2, 3, 1, 4, 'x'] },
    { name: 'Standard (Root 4)', rootString: 3, frets: ['x', 'x', 0, 1, 0, 1], fingers: ['x', 'x', 1, 3, 1, 2] },
    { name: 'Alternative (Root 6)', rootString: 5, frets: [0, 'x', -1, 0, -1, -1], fingers: [2, 'x', 1, 3, 1, 1] },
    { name: 'Alternative (Root 5)', rootString: 4, frets: ['x', 0, 1, -1, 1, 2], fingers: ['x', 2, 3, 1, 4, 4] }
  ],
  'Diminished 9': [
    { name: 'Standard (Root 5)', rootString: 4, frets: ['x', 0, -2, -1, 0, -1], fingers: ['x', 3, 1, 2, 4, 2] },
    { name: 'Standard (Root 6)', rootString: 5, frets: [0, -2, -1, -3, -1, 'x'], fingers: [3, 1, 2, 1, 2, 'x'] },
    { name: 'Jazz Shell (Root 6)', rootString: 5, frets: [0, 'x', -1, 0, -1, 2], fingers: [2, 'x', 1, 3, 1, 4] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 'x', 0, 1, 0, 0], fingers: ['x', 'x', 2, 3, 1, 0] },
    { name: 'Movable Alt (Root 5)', rootString: 4, frets: ['x', 0, -2, -1, 0, 'x'], fingers: ['x', 3, 1, 2, 4, 'x'] }
  ],
  'Diminished 13': [
    { name: 'Standard (Root 5)', rootString: 4, frets: ['x', 0, 1, -1, 1, 1], fingers: ['x', 2, 3, 1, 4, 4] },
    { name: 'Standard (Root 6)', rootString: 5, frets: [0, -2, -1, -3, 1, 'x'], fingers: [3, 1, 2, 1, 4, 'x'] },
    { name: 'Movable (Root 6)', rootString: 5, frets: [0, 'x', -1, 0, 1, 'x'], fingers: [2, 'x', 1, 3, 4, 'x'] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, 1, -1, 1, 'x'], fingers: ['x', 2, 3, 1, 4, 'x'] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 'x', 0, 3, 0, 1], fingers: ['x', 'x', 1, 3, 1, 2] }
  ],
  'Augmented': [
    { name: 'Movable (Root 6)', rootString: 5, frets: [0, 3, 2, 1, 1, 'x'], fingers: [1, 4, 3, 2, 2, 'x'] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, 3, 2, 2, 'x'], fingers: ['x', 1, 4, 2, 3, 'x'] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 'x', 0, -1, -1, -2], fingers: ['x', 'x', 3, 2, 2, 1] },
    { name: 'Movable (Root 3)', rootString: 2, frets: ['x', 'x', 1, 0, 0, -1], fingers: ['x', 'x', 3, 2, 2, 1] },
    { name: 'CAGED C-Shape (Root 5)', rootString: 4, frets: ['x', 0, -1, -2, -2, -3], fingers: ['x', 4, 3, 2, 2, 1] }
  ],
  'Augmented 7': [
    { name: 'Movable (Root 6)', rootString: 5, frets: [0, 'x', 0, 1, 1, 'x'], fingers: [1, 'x', 2, 3, 4, 'x'] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, 3, 0, 2, 'x'], fingers: ['x', 1, 4, 1, 2, 'x'] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 1, 0, -1, 1, 'x'], fingers: ['x', 3, 2, 1, 4, 'x'] },
    { name: 'Movable (Root 3)', rootString: 2, frets: ['x', 'x', 1, 0, 0, 1], fingers: ['x', 'x', 2, 1, 1, 3] },
    { name: 'Movable (Root 5 Alt)', rootString: 4, frets: ['x', 0, 3, 0, 2, 3], fingers: ['x', 1, 3, 1, 2, 4] }
  ],
  'Augmented 9': [
    { name: 'Movable (Root 6)', rootString: 5, frets: [0, 'x', 0, 1, 1, 2], fingers: [1, 'x', 2, 2, 3, 4] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, -1, 0, 0, 1], fingers: ['x', 2, 1, 2, 2, 3] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 1, 0, -1, 1, 0], fingers: ['x', 2, 1, 1, 3, 0] },
    { name: 'Movable (Root 3)', rootString: 2, frets: ['x', 0, 1, 0, 0, 1], fingers: ['x', 0, 2, 0, 0, 3] },
    { name: 'Movable (Root 6 Alt)', rootString: 5, frets: [0, 3, 0, 1, 1, 2], fingers: [1, 3, 1, 1, 1, 2] }
  ],
  'Augmented 7b9': [
    { name: 'Movable (Root 6)', rootString: 5, frets: [0, 'x', 0, 1, 1, 1], fingers: [1, 'x', 2, 3, 4, 1] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, -1, 0, -1, 1], fingers: ['x', 2, 1, 3, 1, 4] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 1, 0, -1, 1, -1], fingers: ['x', 3, 2, 1, 4, 1] },
    { name: 'Movable (Root 3)', rootString: 2, frets: ['x', -1, 1, 0, 0, 1], fingers: ['x', 1, 3, 1, 1, 2] },
    { name: 'Movable (Root 6 Alt)', rootString: 5, frets: [0, 3, 0, 1, 1, 1], fingers: [1, 3, 1, 2, 2, 1] }
  ],
  'Augmented 7#9': [
    { name: 'Movable (Root 6)', rootString: 5, frets: [0, 'x', 0, 1, 1, 3], fingers: [1, 'x', 2, 2, 2, 4] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, -1, 0, 1, 1], fingers: ['x', 2, 1, 2, 3, 4] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 1, 0, -1, 1, 1], fingers: ['x', 2, 1, 1, 3, 3] },
    { name: 'Movable (Root 3)', rootString: 2, frets: ['x', 1, 1, 0, 0, 1], fingers: ['x', 3, 4, 1, 1, 2] },
    { name: 'Movable (Root 6 Alt)', rootString: 5, frets: [0, 3, 0, 1, 1, 3], fingers: [1, 3, 1, 2, 2, 4] }
  ],
  'Major b5': [
    { name: 'Movable (Root 6)', rootString: 5, frets: [0, 1, 2, 1, -1, 0], fingers: [1, 2, 4, 3, 1, 1] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, 1, 2, 2, -1], fingers: ['x', 1, 2, 3, 4, 1] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 'x', 0, 1, 3, 2], fingers: ['x', 'x', 1, 2, 4, 3] },
    { name: 'Movable (Root 3)', rootString: 2, frets: ['x', 'x', -1, 0, 0, -3], fingers: ['x', 'x', 2, 1, 1, 1] },
    { name: 'CAGED C-Shape (Root 5)', rootString: 4, frets: ['x', 0, -1, -4, -2, -3], fingers: ['x', 4, 3, 1, 2, 1] }
  ],
  'Major b9': [
    { name: 'Movable (Root 6)', rootString: 5, frets: [0, 'x', 1, 1, 0, 1], fingers: [1, 'x', 2, 3, 1, 4] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, -1, 1, -1, 0], fingers: ['x', 2, 1, 4, 1, 3] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 0, 0, -1, 2, -1], fingers: ['x', 3, 2, 1, 4, 1] },
    { name: 'Movable (Root 3)', rootString: 2, frets: ['x', -1, 0, 0, 0, 2], fingers: ['x', 1, 2, 2, 2, 4] },
    { name: 'Movable (Root 6 Alt)', rootString: 5, frets: [0, 2, 1, 1, 0, 1], fingers: [1, 3, 1, 1, 0, 2] }
  ],
  'Major #9': [
    { name: 'Movable (Root 6)', rootString: 5, frets: [0, 'x', 1, 1, 0, 3], fingers: [1, 'x', 2, 3, 1, 4] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, -1, 1, 1, 0], fingers: ['x', 2, 1, 3, 4, 3] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 0, 0, -1, 2, 1], fingers: ['x', 3, 1, 1, 4, 2] },
    { name: 'Movable (Root 3)', rootString: 2, frets: ['x', 1, 0, 0, 0, 2], fingers: ['x', 2, 3, 1, 1, 4] },
    { name: 'Movable (Root 6 Alt)', rootString: 5, frets: [0, 2, 1, 1, 0, 3], fingers: [1, 3, 1, 1, 0, 4] }
  ],
  'Minor b9': [
    { name: 'Movable (Root 6)', rootString: 5, frets: [0, 'x', 0, 0, 0, 1], fingers: [1, 'x', 2, 2, 2, 3] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, -2, 0, -1, 0], fingers: ['x', 2, 1, 3, 1, 2] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 0, 0, -2, 1, -1], fingers: ['x', 3, 2, 1, 4, 1] },
    { name: 'Movable (Root 3)', rootString: 2, frets: ['x', -1, 0, 0, -1, 1], fingers: ['x', 1, 3, 2, 1, 4] },
    { name: 'Movable (Root 6 Alt)', rootString: 5, frets: [0, 2, 0, 0, 0, 1], fingers: [1, 3, 1, 1, 1, 2] }
  ],
  'Minor #9': [
    { name: 'Movable (Root 6)', rootString: 5, frets: [0, 'x', 0, 0, 0, 3], fingers: [1, 'x', 2, 2, 2, 4] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, -2, 0, 1, 0], fingers: ['x', 2, 1, 4, 3, 2] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 0, 0, -2, 1, 1], fingers: ['x', 3, 1, 1, 4, 4] },
    { name: 'Movable (Root 3)', rootString: 2, frets: ['x', 1, 0, 0, -1, 1], fingers: ['x', 3, 4, 2, 1, 4] },
    { name: 'Movable (Root 6 Alt)', rootString: 5, frets: [0, 2, 0, 0, 0, 3], fingers: [1, 3, 1, 1, 1, 4] }
  ],
  'Minor #5': [
    { name: 'Movable (Root 6)', rootString: 5, frets: [0, 3, 2, 0, 'x', 'x'], fingers: [1, 4, 2, 1, 'x', 'x'] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, 3, 2, 1, 'x'], fingers: ['x', 1, 4, 2, 3, 'x'] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 'x', 0, -2, -1, -2], fingers: ['x', 'x', 3, 1, 2, 1] },
    { name: 'Movable (Root 3)', rootString: 2, frets: ['x', 'x', 1, 0, -1, -1], fingers: ['x', 'x', 3, 2, 1, 1] },
    { name: 'CAGED C-Shape (Root 5)', rootString: 4, frets: ['x', 0, -2, -2, -2, -4], fingers: ['x', 4, 2, 2, 2, 1] }
  ],
  'Dominant 7b5': [
    { name: 'Movable (Root 6)', rootString: 5, frets: [0, 'x', 0, 1, -1, 'x'], fingers: [1, 'x', 3, 2, 1, 'x'] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, 1, 0, 2, 'x'], fingers: ['x', 1, 2, 1, 3, 'x'] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 'x', 0, 1, 1, 2], fingers: ['x', 'x', 1, 2, 2, 3] },
    { name: 'Movable (Root 3)', rootString: 2, frets: ['x', 'x', -1, 0, 0, 1], fingers: ['x', 'x', 2, 1, 1, 3] },
    { name: 'Movable (Root 5 Alt)', rootString: 4, frets: ['x', 0, 1, 2, 2, 3], fingers: ['x', 1, 2, 3, 3, 4] }
  ],
  'Dominant 7b9': [
    { name: 'Movable (Root 6)', rootString: 5, frets: [0, 'x', 0, 1, 0, 1], fingers: [1, 'x', 2, 3, 1, 4] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, -1, 0, -1, 0], fingers: ['x', 2, 1, 3, 1, 2] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 0, 0, -1, 1, -1], fingers: ['x', 3, 2, 1, 4, 1] },
    { name: 'Movable (Root 3)', rootString: 2, frets: ['x', -1, 0, 0, 0, 1], fingers: ['x', 1, 3, 2, 2, 4] },
    { name: 'Movable (Root 6 Alt)', rootString: 5, frets: [0, 2, 0, 1, 0, 1], fingers: [1, 3, 1, 2, 1, 2] }
  ],
  'Dominant 7#9': [
    { name: 'Movable (Root 6)', rootString: 5, frets: [0, 'x', 0, 1, 0, 3], fingers: [1, 'x', 2, 2, 2, 4] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, -1, 0, 1, 0], fingers: ['x', 2, 1, 3, 4, 2] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 0, 0, -1, 1, 1], fingers: ['x', 3, 1, 1, 4, 4] },
    { name: 'Movable (Root 3)', rootString: 2, frets: ['x', 1, 0, 0, 0, 1], fingers: ['x', 3, 4, 2, 2, 4] },
    { name: 'Movable (Root 6 Alt)', rootString: 5, frets: [0, 2, 0, 1, 0, 3], fingers: [1, 3, 1, 2, 1, 4] }
  ],
  'Dominant 7#5': [
    { name: 'Movable (Root 6)', rootString: 5, frets: [0, 'x', 0, 1, 1, 'x'], fingers: [1, 'x', 2, 3, 4, 'x'] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, 3, 0, 2, 'x'], fingers: ['x', 1, 4, 1, 2, 'x'] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 1, 0, -1, 1, 'x'], fingers: ['x', 3, 2, 1, 4, 'x'] },
    { name: 'Movable (Root 3)', rootString: 2, frets: ['x', 'x', 1, 0, 0, 1], fingers: ['x', 'x', 2, 1, 1, 3] },
    { name: 'Movable (Root 5 Alt)', rootString: 4, frets: ['x', 0, 3, 0, 2, 3], fingers: ['x', 1, 3, 1, 2, 4] }
  ],
  'Diminished b9': [
    { name: 'Movable (Root 6)', rootString: 5, frets: [0, 'x', -1, 0, -1, 1], fingers: [2, 'x', 1, 3, 1, 4] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, -2, -1, -2, -1], fingers: ['x', 3, 1, 2, 1, 2] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 2, 0, 1, 4, 1], fingers: ['x', 3, 1, 2, 4, 1] },
    { name: 'Movable (Root 3)', rootString: 2, frets: ['x', -1, -1, 0, -1, 0], fingers: ['x', 1, 1, 2, 1, 3] },
    { name: 'Movable (Root 6 Alt)', rootString: 5, frets: [0, -2, -1, -3, -1, 1], fingers: [2, 1, 3, 1, 4, 1] }
  ],
  'Augmented 6': [
    { name: 'Movable (Root 6)', rootString: 5, frets: [0, 'x', -1, 1, 1, 'x'], fingers: [1, 'x', 1, 2, 3, 'x'] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, 3, -1, 2, 'x'], fingers: ['x', 1, 4, 1, 2, 'x'] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 1, 0, -1, 0, 'x'], fingers: ['x', 2, 1, 1, 1, 'x'] },
    { name: 'Movable (Root 3)', rootString: 2, frets: ['x', 'x', 1, 0, 0, 0], fingers: ['x', 'x', 2, 1, 1, 1] },
    { name: 'Movable (Root 5 Alt)', rootString: 4, frets: ['x', 0, 3, 2, 2, 2], fingers: ['x', 1, 3, 2, 2, 2] }
  ],
  'Augmented 13': [
    { name: 'Movable (Root 6)', rootString: 5, frets: [0, 3, 0, 1, 2, 2], fingers: [1, 3, 1, 1, 2, 2] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, 3, 0, 2, 2], fingers: ['x', 1, 3, 1, 2, 2] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 1, 0, -1, 0, 0], fingers: ['x', 2, 1, 1, 0, 0] },
    { name: 'Movable (Root 3)', rootString: 2, frets: ['x', -4, 1, 0, 0, 0], fingers: ['x', 1, 3, 1, 1, 1] },
    { name: 'Movable (Root 5 Alt)', rootString: 4, frets: ['x', 0, 3, 0, 0, 2], fingers: ['x', 0, 3, 0, 0, 2] }
  ],
  'Augmented b5': [
    { name: 'Movable (Root 6)', rootString: 5, frets: [0, 3, 2, 1, -1, 'x'], fingers: [1, 4, 2, 1, 1, 'x'] },
    { name: 'Movable (Root 5)', rootString: 4, frets: ['x', 0, 3, 2, 2, -1], fingers: ['x', 1, 4, 1, 2, 1] },
    { name: 'Movable (Root 4)', rootString: 3, frets: ['x', 'x', 0, -1, -1, 4], fingers: ['x', 'x', 1, 1, 1, 4] },
    { name: 'Movable (Root 3)', rootString: 2, frets: ['x', 'x', -1, 0, 0, -1], fingers: ['x', 'x', 2, 1, 1, 1] },
    { name: 'Movable (Root 5 Alt)', rootString: 4, frets: ['x', 0, -1, -2, -2, -1], fingers: ['x', 2, 1, 3, 1, 1] }
  ]
};

// Helper to normalize notes to sharp format
export function normalizeNoteName(noteName) {
  const trimmed = noteName.trim();
  return ENHARMONIC_MAP[trimmed] || trimmed;
}

// Get chromatic number of a note (0 to 11)
export function getNoteChromaticNumber(noteName) {
  const normalized = normalizeNoteName(noteName);
  return CHROMATIC_SCALE.indexOf(normalized);
}

// Get the fret of a note on a specific string
// stringIndex: 0 (6th string/E) to 5 (1st string/E)
export function getFretForNoteOnString(noteNum, stringIndex) {
  // Open string chromatic values: E=4, A=9, D=2, G=7, B=11, E=4
  const openNotes = [4, 9, 2, 7, 11, 4];
  const openVal = openNotes[stringIndex];
  return (noteNum - openVal + 12) % 12;
}

/**
 * Generates all available voicings for a given note and chord flavor.
 * Returns an array of Voicing objects: { voicingName, frets, fingers, midiNotes, notes }
 */
export function getChordVoicings(noteName, flavor) {
  const normalizedRoot = normalizeNoteName(noteName);
  const rootMidiIndex = getNoteChromaticNumber(normalizedRoot);
  if (rootMidiIndex === -1) return [];

  const voicings = [];

  // 1. Check if there is a predefined Open position chord
  if (OPEN_CHORDS[normalizedRoot] && OPEN_CHORDS[normalizedRoot][flavor]) {
    const chord = OPEN_CHORDS[normalizedRoot][flavor];
    const resolvedFrets = chord.frets.map(f => f === 'x' ? -1 : f);
    const resolvedFingers = chord.fingers.map(f => f === 'x' ? -1 : f);
    const midiNotes = calculateMidiNotes(resolvedFrets);
    const notes = calculateNoteNames(resolvedFrets);
    voicings.push({
      voicingName: 'Open Position',
      frets: resolvedFrets,
      fingers: resolvedFingers,
      midiNotes,
      notes
    });
  }

  // 2. Generate movable shape voicings
  const shapes = MOVABLE_SHAPES[flavor] || [];
  for (const shape of shapes) {
    const stringIndex = 5 - shape.rootString;
    const rootFret = getFretForNoteOnString(rootMidiIndex, stringIndex);

    const frets = [];
    const fingers = [];

    for (let s = 0; s < 6; s++) {
      const templateVal = shape.frets[s];
      const fingerVal = shape.fingers[s];

      if (templateVal === 'x') {
        frets.push(-1);
        fingers.push(-1);
      } else {
        frets.push(rootFret + templateVal);
        fingers.push(fingerVal === 'x' ? -1 : fingerVal);
      }
    }

    // Keep shapes in playable fretboard range (up to 15 frets max)
    const maxFret = Math.max(...frets);
    const minFret = Math.min(...frets.filter(f => f >= 0));

    if (minFret >= 0 && maxFret <= 15) {
      const midiNotes = calculateMidiNotes(frets);
      const notes = calculateNoteNames(frets);
      voicings.push({
        voicingName: shape.name,
        frets,
        fingers,
        midiNotes,
        notes
      });
    }
  }

  // Ensure unique voicings by matching their fret combinations
  const uniqueVoicings = [];
  const seenFrets = new Set();

  for (const v of voicings) {
    const key = v.frets.join(',');
    if (!seenFrets.has(key)) {
      seenFrets.add(key);
      uniqueVoicings.push(v);
    }
  }

  return uniqueVoicings.slice(0, 5);
}

// Calculate MIDI notes for each string given the fret array
export function calculateMidiNotes(frets) {
  return frets.map((fret, stringIdx) => {
    if (fret === -1 || fret === 'x') return -1;
    return OPEN_STRING_MIDI[stringIdx] + fret;
  });
}

// Calculate note name strings for each string given the fret array
export function calculateNoteNames(frets) {
  const openNotes = [4, 9, 2, 7, 11, 4]; // E, A, D, G, B, E
  return frets.map((fret, stringIdx) => {
    if (fret === -1 || fret === 'x') return 'x';
    const noteVal = (openNotes[stringIdx] + fret) % 12;
    return CHROMATIC_SCALE[noteVal];
  });
}

// Circle of Fifths keys in order (clockwise)
export const CIRCLE_KEYS_MAJOR = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
export const CIRCLE_KEYS_MINOR = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'Bbm', 'Fm', 'Cm', 'Gm', 'Dm'];

// Map to key signature description
const KEY_SIGNATURES = {
  'C': 'No sharps or flats',
  'G': '1 Sharp (F#)',
  'D': '2 Sharps (F#, C#)',
  'A': '3 Sharps (F#, C#, G#)',
  'E': '4 Sharps (F#, C#, G#, D#)',
  'B': '5 Sharps (F#, C#, G#, D#, A#)',
  'F#': '6 Sharps (F#, C#, G#, D#, A#, E#)',
  'Db': '5 Flats (Bb, Eb, Ab, Db, Gb)',
  'Ab': '4 Flats (Bb, Eb, Ab, Db)',
  'Eb': '3 Flats (Bb, Eb, Ab)',
  'Bb': '2 Flats (Bb, Eb)',
  'F': '1 Flat (Bb)',
  'Am': 'No sharps or flats (Relative of C Major)',
  'Em': '1 Sharp (F#) (Relative of G Major)',
  'Bm': '2 Sharps (F#, C#) (Relative of D Major)',
  'F#m': '3 Sharps (F#, C#, G#) (Relative of A Major)',
  'C#m': '4 Sharps (F#, C#, G#, D#) (Relative of E Major)',
  'G#m': '5 Sharps (F#, C#, G#, D#, A#) (Relative of B Major)',
  'D#m': '6 Sharps (F#, C#, G#, D#, A#, E#) (Relative of F# Major)',
  'Bbm': '5 Flats (Bb, Eb, Ab, Db, Gb) (Relative of Db Major)',
  'Fm': '4 Flats (Bb, Eb, Ab, Db) (Relative of Ab Major)',
  'Cm': '3 Flats (Bb, Eb, Ab) (Relative of Eb Major)',
  'Gm': '2 Flats (Bb, Eb) (Relative of Bb Major)',
  'Dm': '1 Flat (Bb) (Relative of F Major)'
};

/**
 * Returns info about a key in the Circle of Fifths.
 * @param {string} keyName - Name of the key (e.g. "C" or "Am").
 */
export function getKeyDetails(keyName) {
  const isMinor = keyName.endsWith('m');
  const root = isMinor ? keyName.slice(0, -1) : keyName;
  const normalizedRoot = normalizeNoteName(root);
  const chromaticRoot = getNoteChromaticNumber(normalizedRoot);

  const sig = KEY_SIGNATURES[keyName] || '';
  const chords = [];

  if (!isMinor) {
    const majorIntervals = [
      { degree: 'I', semitones: 0, quality: 'Major' },
      { degree: 'ii', semitones: 2, quality: 'Minor' },
      { degree: 'iii', semitones: 4, quality: 'Minor' },
      { degree: 'IV', semitones: 5, quality: 'Major' },
      { degree: 'V', semitones: 7, quality: 'Dominant' },
      { degree: 'vi', semitones: 9, quality: 'Minor' },
      { degree: 'vii°', semitones: 11, quality: 'Diminished' }
    ];

    for (const val of majorIntervals) {
      const noteVal = (chromaticRoot + val.semitones) % 12;
      const noteName = CHROMATIC_SCALE[noteVal];
      chords.push({
        degree: val.degree,
        note: noteName,
        flavor: val.quality,
        fullName: `${noteName} ${val.quality}`
      });
    }
  } else {
    const minorIntervals = [
      { degree: 'i', semitones: 0, quality: 'Minor' },
      { degree: 'ii°', semitones: 2, quality: 'Diminished' },
      { degree: 'III', semitones: 3, quality: 'Major' },
      { degree: 'iv', semitones: 5, quality: 'Minor' },
      { degree: 'v', semitones: 7, quality: 'Minor' },
      { degree: 'VI', semitones: 8, quality: 'Major' },
      { degree: 'VII', semitones: 10, quality: 'Major' }
    ];

    for (const val of minorIntervals) {
      const noteVal = (chromaticRoot + val.semitones) % 12;
      const noteName = CHROMATIC_SCALE[noteVal];
      chords.push({
        degree: val.degree,
        note: noteName,
        flavor: val.quality,
        fullName: `${noteName} ${val.quality}`
      });
    }
  }

  return {
    keyName,
    isMinor,
    rootNote: normalizedRoot,
    signature: sig,
    diatonicChords: chords
  };
}
