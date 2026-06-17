import { initAudio, playNote, playChord, setMasterVolume } from './audio.js?v=10';
import { 
  CHROMATIC_SCALE, 
  getChordVoicings, 
  getChordFlavor,
  getKeyDetails, 
  CIRCLE_KEYS_MAJOR, 
  CIRCLE_KEYS_MINOR, 
  OPEN_STRING_MIDI, 
  STRING_NAMES,
  normalizeNoteName,
  getNoteChromaticNumber
} from './chords.js?v=10';

// --- State Management ---
let state = {
  activeTab: 'chord-explorer-view',
  chord: {
    rootNote: 'C',
    quality: 'Major',      // 'Major', 'Minor', 'Diminished', 'Dominant'
    extension: 'normal',    // 'normal', '6', '7', '9', '13'
    voicingIndex: 0,
    activeSubTab: 'subtab-visualizer' // 'subtab-visualizer' or 'subtab-voicings'
  },
  circle: {
    selectedKey: 'C',
    playMode: 'note' // 'note' or 'chord'
  }
};

// --- Fretboard Coordinates Setup (15 Frets) ---
const startX = 60; // nut position
const endX = 860;  // 15th fret position
const fretboardWidth = endX - startX;
const numFrets = 15; // Expanded to 15 frets to fit D# and higher-register barre shapes!

// Calculate fret line X coordinates using a realistic 0.94 decay ratio
const fretX = [startX];
let sum = 0;
const decay = 0.94;
for (let i = 0; i < numFrets; i++) {
  sum += Math.pow(decay, i);
}
let accumulated = 0;
for (let i = 1; i <= numFrets; i++) {
  accumulated += Math.pow(decay, i - 1);
  fretX.push(startX + (accumulated / sum) * fretboardWidth);
}

// String Y positions (6th string E at bottom, 1st string E at top)
const stringY = [];
for (let s = 0; s < 6; s++) {
  stringY.push(150 - s * 24); // 6th is 150, 5th is 126, 4th is 102, 3rd is 78, 2nd is 54, 1st is 30
}
const stringThicknesses = [3.5, 2.8, 2.2, 1.6, 1.2, 0.8];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  renderRootNoteGrid();
  renderQualityList();
  renderExtensionGrid();
  updateChordExplorer();
  renderCircleOfFifths();
  updateCircleDetails();
});

// --- Event Listeners Setup ---
function setupEventListeners() {
  // Main Navigation Tabs
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const targetView = e.currentTarget.getAttribute('data-tab');
      switchTab(targetView);
    });
  });

  // Explorer Sub-tabs Navigation
  const subtabs = document.querySelectorAll('.subtab-btn');
  subtabs.forEach(subtab => {
    subtab.addEventListener('click', (e) => {
      const targetSubTab = e.currentTarget.getAttribute('data-subtab');
      switchSubTab(targetSubTab);
    });
  });

  // Volume control
  const volumeSlider = document.getElementById('volume-slider');
  volumeSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    setMasterVolume(val);
  });

  // Strum Chord button
  const playBtn = document.getElementById('btn-play-strum');
  playBtn.addEventListener('click', () => {
    initAudio();
    triggerCurrentChordStrum();
  });

  // Circle Play Mode Toggles
  const modeBtns = document.querySelectorAll('#circle-play-mode .toggle-btn');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      modeBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      state.circle.playMode = e.currentTarget.getAttribute('data-mode');
    });
  });
}

// --- Main Tab Switching ---
function switchTab(viewId) {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    if (tab.getAttribute('data-tab') === viewId) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  const panels = document.querySelectorAll('.view-panel');
  panels.forEach(panel => {
    if (panel.id === viewId) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  state.activeTab = viewId;
  initAudio();
}

// --- Explorer Sub-Tab Switching ---
function switchSubTab(subTabId) {
  state.chord.activeSubTab = subTabId;

  // Update button active state
  const subtabs = document.querySelectorAll('.subtab-btn');
  subtabs.forEach(btn => {
    if (btn.getAttribute('data-subtab') === subTabId) {
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    }
  });

  // Toggle visibility of panels
  const panels = document.querySelectorAll('.subtab-panel');
  panels.forEach(panel => {
    if (panel.id === subTabId) {
      panel.style.display = 'block';
    } else {
      panel.style.display = 'none';
    }
  });

  // Re-render subtab specific items if necessary
  if (subTabId === 'subtab-voicings') {
    const internalFlavor = getChordFlavor(state.chord.quality, state.chord.extension);
    const voicings = getChordVoicings(state.chord.rootNote, internalFlavor);
    renderVoicingsComparison(voicings);
  }
}

// --- Render Chord Explorer Sidebar Filters ---

function renderRootNoteGrid() {
  const container = document.getElementById('root-note-grid');
  container.innerHTML = '';

  CHROMATIC_SCALE.forEach(note => {
    const btn = document.createElement('button');
    btn.className = 'note-btn';
    if (note === state.chord.rootNote) {
      btn.classList.add('active');
    }
    btn.textContent = note;
    btn.id = `btn-note-${note.replace('#', 'sharp')}`;
    btn.addEventListener('click', () => {
      initAudio();
      state.chord.rootNote = note;
      state.chord.voicingIndex = 0;
      updateRootNoteSelection();
      updateChordExplorer();
    });
    container.appendChild(btn);
  });
}

function updateRootNoteSelection() {
  const buttons = document.querySelectorAll('.note-btn');
  buttons.forEach(btn => {
    if (btn.textContent === state.chord.rootNote) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function renderQualityList() {
  const container = document.getElementById('chord-quality-list');
  container.innerHTML = '';

  const qualities = ['Major', 'Minor', 'Diminished', 'Dominant', 'Augmented'];

  qualities.forEach(q => {
    const btn = document.createElement('button');
    btn.className = 'flavor-btn';
    if (q === state.chord.quality) {
      btn.classList.add('active');
    }
    btn.id = `btn-quality-${q}`;
    
    // Add brief labels for quality suffixes
    const suffixMap = { Major: 'maj', Minor: 'min', Diminished: 'dim', Dominant: 'dom', Augmented: 'aug' };
    btn.innerHTML = `<span>${q}</span><span class="chord-suffix">${suffixMap[q]}</span>`;
    
    btn.addEventListener('click', () => {
      initAudio();
      state.chord.quality = q;
      state.chord.voicingIndex = 0;
      
      document.querySelectorAll('#chord-quality-list .flavor-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      updateChordExplorer();
    });
    container.appendChild(btn);
  });
}

function renderExtensionGrid() {
  const container = document.getElementById('chord-extension-grid');
  container.innerHTML = '';

  const extensions = [
    { value: 'normal', label: 'normal' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '9', label: '9' },
    { value: '13', label: '13' },
    { value: 'b5', label: 'b5' },
    { value: 'b9', label: 'b9' },
    { value: '#9', label: '#9' },
    { value: '#5', label: '#5' }
  ];

  extensions.forEach(ext => {
    const btn = document.createElement('button');
    btn.className = 'note-btn';
    if (ext.value === state.chord.extension) {
      btn.classList.add('active');
    }
    btn.textContent = ext.label;
    btn.id = `btn-extension-${ext.value}`;
    
    btn.addEventListener('click', () => {
      initAudio();
      state.chord.extension = ext.value;
      state.chord.voicingIndex = 0;
      
      document.querySelectorAll('#chord-extension-grid .note-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      updateChordExplorer();
    });
    container.appendChild(btn);
  });
}

// --- Render Voicings Comparison Grid (All 5 Voicings Tab) ---
function renderVoicingsComparison(voicings) {
  const grid = document.getElementById('voicings-comparison-grid');
  grid.innerHTML = '';

  if (voicings.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem 0;">No voicings found for this chord combination.</p>';
    return;
  }

  voicings.forEach((v, index) => {
    const card = document.createElement('div');
    card.className = 'voicing-card';
    if (index === state.chord.voicingIndex) {
      card.classList.add('active');
    }
    card.id = `voicing-card-${index}`;

    // 1. Voicing Header
    const title = document.createElement('h3');
    title.textContent = v.voicingName;
    card.appendChild(title);

    // 2. Mini Fretboard SVG Representation
    const miniSvg = drawMiniFretboard(v);
    card.appendChild(miniSvg);

    // 3. Fret labels details text
    const details = document.createElement('div');
    details.className = 'voicing-card-details';
    details.textContent = 'Frets: ' + v.frets.map(f => f === -1 ? 'x' : f).join(' ');
    card.appendChild(details);

    // Click to select and switch back to Visualizer
    card.addEventListener('click', () => {
      initAudio();
      state.chord.voicingIndex = index;
      
      // Update UI active card
      document.querySelectorAll('.voicing-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      // Sync and switch back
      updateChordExplorer();
      switchSubTab('subtab-visualizer');

      // Strum chord automatically
      triggerChordStrum(v.midiNotes);
    });

    grid.appendChild(card);
  });
}

// Draws a compact horizontal fretboard SVG for comparison cards
function drawMiniFretboard(voicing) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'mini-fretboard-svg');
  svg.setAttribute('viewBox', '0 0 200 55');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');

  const miniStartX = 15;
  const miniEndX = 190;
  const miniWidth = miniEndX - miniStartX;
  
  // Calculate relative fret widths for the 15-fret miniature neck
  const miniFretX = [miniStartX];
  let minSum = 0;
  const miniDecay = 0.94;
  for (let i = 0; i < 15; i++) {
    minSum += Math.pow(miniDecay, i);
  }
  let minAcc = 0;
  for (let i = 1; i <= 15; i++) {
    minAcc += Math.pow(miniDecay, i - 1);
    miniFretX.push(miniStartX + (minAcc / minSum) * miniWidth);
  }

  // String Y positions (6th bottom, 1st top)
  const miniStringY = [];
  for (let s = 0; s < 6; s++) {
    miniStringY.push(47 - s * 8); // 6th is 47, 5th is 39, 4th is 31, 3rd is 23, 2nd is 15, 1st is 7
  }

  // Draw Wood background
  const wood = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  wood.setAttribute('x', miniStartX);
  wood.setAttribute('y', 4);
  wood.setAttribute('width', miniWidth);
  wood.setAttribute('height', 46);
  wood.setAttribute('fill', 'var(--fretboard-wood)');
  wood.setAttribute('rx', 2);
  svg.appendChild(wood);

  // Draw Nut
  const nut = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  nut.setAttribute('x', miniStartX - 3);
  nut.setAttribute('y', 4);
  nut.setAttribute('width', 3);
  nut.setAttribute('height', 46);
  nut.setAttribute('fill', 'var(--fretboard-nut)');
  svg.appendChild(nut);

  // Draw Frets (15 wires)
  for (let f = 0; f <= 15; f++) {
    const x = miniFretX[f];
    const wire = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    wire.setAttribute('x1', x);
    wire.setAttribute('y1', 4);
    wire.setAttribute('x2', x);
    wire.setAttribute('y2', 50);
    wire.setAttribute('stroke', 'var(--fret-wire)');
    wire.setAttribute('stroke-width', 0.8);
    svg.appendChild(wire);
  }

  // Draw Strings
  for (let s = 0; s < 6; s++) {
    const y = miniStringY[s];
    const stringLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    stringLine.setAttribute('x1', miniStartX - 3);
    stringLine.setAttribute('y1', y);
    stringLine.setAttribute('x2', miniEndX);
    stringLine.setAttribute('y2', y);
    stringLine.setAttribute('stroke', '#8C8475');
    // Simplified string thicknesses
    stringLine.setAttribute('stroke-width', s < 3 ? 1 : 0.5);
    svg.appendChild(stringLine);
  }

  // Draw Fingering Dots
  voicing.frets.forEach((fret, stringIdx) => {
    const y = miniStringY[stringIdx];
    if (fret > 0 && fret <= 15) {
      const xPrev = miniFretX[fret - 1];
      const xCurr = miniFretX[fret];
      const xCenter = (xPrev + xCurr) / 2;

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', xCenter);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', 3);
      
      const isRoot = voicing.notes[stringIdx] === state.chord.rootNote;
      if (isRoot) {
        circle.setAttribute('fill', 'var(--text-color)');
        circle.setAttribute('stroke', 'var(--accent-gold)');
        circle.setAttribute('stroke-width', 0.8);
      } else {
        circle.setAttribute('fill', 'var(--accent-color)');
        circle.setAttribute('stroke', '#FFFFFF');
        circle.setAttribute('stroke-width', 0.5);
      }
      svg.appendChild(circle);
    } else if (fret === 0) {
      // Small open circle above nut
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', miniStartX - 8);
      text.setAttribute('y', y + 2.5);
      text.setAttribute('style', 'font-family: sans-serif; font-size: 6px; fill: #61A375; font-weight: bold; text-anchor: middle;');
      text.textContent = 'o';
      svg.appendChild(text);
    } else if (fret === -1) {
      // Small 'x' above nut
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', miniStartX - 8);
      text.setAttribute('y', y + 2.5);
      text.setAttribute('style', 'font-family: sans-serif; font-size: 6px; fill: #C96A6A; font-weight: bold; text-anchor: middle;');
      text.textContent = 'x';
      svg.appendChild(text);
    }
  });

  return svg;
}

// --- Update Fretboard Explorer View ---
function updateChordExplorer() {
  const internalFlavor = getChordFlavor(state.chord.quality, state.chord.extension);
  const voicings = getChordVoicings(state.chord.rootNote, internalFlavor);

  // Sync sub-tabs and active panels
  if (state.chord.activeSubTab === 'subtab-voicings') {
    renderVoicingsComparison(voicings);
  }

  // Safe checks on voicing Index
  if (state.chord.voicingIndex >= voicings.length) {
    state.chord.voicingIndex = 0;
  }

  const activeVoicing = voicings[state.chord.voicingIndex];
  if (activeVoicing) {
    drawFretboard(activeVoicing);
    updateChordDetails(activeVoicing);
  } else {
    drawFretboard(null);
    clearChordDetails();
  }

  // Update display headers
  const displayChordNameText = `${state.chord.rootNote} ${state.chord.quality}${state.chord.extension !== 'normal' ? ' ' + state.chord.extension : ''}`;
  document.getElementById('display-chord-name').textContent = displayChordNameText;
  document.getElementById('display-voicing-name').textContent = activeVoicing ? activeVoicing.voicingName : 'N/A';
}

function updateChordDetails(voicing) {
  const internalFlavor = getChordFlavor(state.chord.quality, state.chord.extension);
  const formulaMap = {
    'Major': '1 - 3 - 5',
    'Major 6': '1 - 3 - 5 - 6',
    'Major 7': '1 - 3 - 5 - 7',
    'Major 9': '1 - 3 - 5 - 7 - 9',
    'Major 13': '1 - 3 - 5 - 7 - 9 - 13',
    'Major b5': '1 - 3 - b5',
    'Major b9': '1 - 3 - 5 - 7 - b9',
    'Major #9': '1 - 3 - 5 - 7 - #9',
    'Minor': '1 - b3 - 5',
    'Minor 6': '1 - b3 - 5 - 6',
    'Minor 7': '1 - b3 - 5 - b7',
    'Minor 9': '1 - b3 - 5 - b7 - 9',
    'Minor 13': '1 - b3 - 5 - b7 - 9 - 13',
    'Minor b9': '1 - b3 - 5 - b7 - b9',
    'Minor #9': '1 - b3 - 5 - b7 - #9',
    'Minor #5': '1 - b3 - #5',
    'Dominant 6': '1 - 3 - 5 - 6 - b7',
    'Dominant 7': '1 - 3 - 5 - b7',
    'Dominant 9': '1 - 3 - 5 - b7 - 9',
    'Dominant 13': '1 - 3 - 5 - b7 - 9 - 13',
    'Dominant 7b5': '1 - 3 - b5 - b7',
    'Dominant 7b9': '1 - 3 - 5 - b7 - b9',
    'Dominant 7#9': '1 - 3 - 5 - b7 - #9',
    'Dominant 7#5': '1 - 3 - #5 - b7',
    'Diminished': '1 - b3 - b5',
    'Diminished 7': '1 - b3 - b5 - bb7',
    'Diminished 9': '1 - b3 - b5 - bb7 - 9',
    'Diminished 13': '1 - b3 - b5 - bb7 - b13',
    'Diminished b9': '1 - b3 - b5 - bb7 - b9',
    'Augmented': '1 - 3 - #5',
    'Augmented 6': '1 - 3 - #5 - 6',
    'Augmented 7': '1 - 3 - #5 - b7',
    'Augmented 9': '1 - 3 - #5 - b7 - 9',
    'Augmented 13': '1 - 3 - #5 - b7 - 9 - 13',
    'Augmented b5': '1 - 3 - b5 - #5',
    'Augmented 7b9': '1 - 3 - #5 - b7 - b9',
    'Augmented 7#9': '1 - 3 - #5 - b7 - #9'
  };

  document.getElementById('info-formula').textContent = formulaMap[internalFlavor] || 'Custom';
  
  // Show note names in chord voicing
  const noteList = voicing.notes.filter(n => n !== 'x');
  const uniqueNotes = [...new Set(noteList)];
  document.getElementById('info-note-names').textContent = uniqueNotes.join(' - ');

  // Show frets
  const fretsString = voicing.frets.map(f => f === -1 ? 'x' : f).join(' - ');
  document.getElementById('info-string-frets').textContent = fretsString;
}

function clearChordDetails() {
  document.getElementById('info-formula').textContent = '-';
  document.getElementById('info-note-names').textContent = '-';
  document.getElementById('info-string-frets').textContent = '-';
}

// --- Draw Main Guitar Fretboard SVG (15 Frets) ---
function drawFretboard(voicing) {
  const svg = document.getElementById('fretboard-svg');
  svg.innerHTML = '';

  // 1. Draw Fretboard Wood Background Rect
  const wood = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  wood.setAttribute('x', startX);
  wood.setAttribute('y', 20);
  wood.setAttribute('width', fretboardWidth);
  wood.setAttribute('height', 140);
  wood.setAttribute('class', 'fretboard-wood-rect');
  wood.setAttribute('rx', 4);
  svg.appendChild(wood);

  // 2. Draw Fretboard Nut (fret 0)
  const nut = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  nut.setAttribute('x', startX - 8);
  nut.setAttribute('y', 20);
  nut.setAttribute('width', 8);
  nut.setAttribute('height', 140);
  nut.setAttribute('class', 'fretboard-nut-rect');
  nut.setAttribute('rx', 2);
  svg.appendChild(nut);

  // 3. Draw Fret Markers (Dots at 3, 5, 7, 9, 12, 15)
  const markerFrets = [3, 5, 7, 9, 12, 15];
  markerFrets.forEach(f => {
    const xPrev = fretX[f - 1];
    const xCurr = fretX[f];
    const xCenter = (xPrev + xCurr) / 2;

    if (f === 12) {
      // Double dots
      const dot1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot1.setAttribute('cx', xCenter);
      dot1.setAttribute('cy', 55);
      dot1.setAttribute('r', 5.5);
      dot1.setAttribute('class', 'fret-marker');
      svg.appendChild(dot1);

      const dot2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot2.setAttribute('cx', xCenter);
      dot2.setAttribute('cy', 115);
      dot2.setAttribute('r', 5.5);
      dot2.setAttribute('class', 'fret-marker');
      svg.appendChild(dot2);
    } else {
      // Single dot
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', xCenter);
      dot.setAttribute('cy', 85);
      dot.setAttribute('r', 5.5);
      dot.setAttribute('class', 'fret-marker');
      svg.appendChild(dot);
    }
  });

  // 4. Draw Fret wires (metal bars)
  for (let f = 0; f <= numFrets; f++) {
    const x = fretX[f];
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x);
    line.setAttribute('y1', 20);
    line.setAttribute('x2', x);
    line.setAttribute('y2', 160);
    line.setAttribute('class', 'fret-line');
    svg.appendChild(line);
    
    // Draw fret numbers under the fretboard
    if (f > 0) {
      const xPrev = fretX[f - 1];
      const xCenter = (xPrev + x) / 2;
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', xCenter);
      text.setAttribute('y', 175);
      text.setAttribute('class', 'fret-num-text');
      text.textContent = f;
      svg.appendChild(text);
    }
  }

  // 5. Draw Strings (spaced vertically)
  for (let s = 0; s < 6; s++) {
    const y = stringY[s];
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', startX - 8);
    line.setAttribute('y1', y);
    line.setAttribute('x2', endX);
    line.setAttribute('y2', y);
    line.setAttribute('class', 'string-line');
    line.setAttribute('style', `stroke-width: ${stringThicknesses[s]}px;`);
    svg.appendChild(line);

    // Add string open note names on the far left side
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', startX - 32);
    label.setAttribute('y', y);
    label.setAttribute('class', 'string-label');
    label.textContent = STRING_NAMES[s];
    svg.appendChild(label);
  }

  // 6. Draw Chord fingering dots and nut indicators
  if (voicing) {
    voicing.frets.forEach((fret, stringIndex) => {
      const y = stringY[stringIndex];
      
      if (fret === -1) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', startX - 18);
        text.setAttribute('y', y + 3);
        text.setAttribute('class', 'string-nut-indicator muted');
        text.textContent = '×';
        svg.appendChild(text);
      } else if (fret === 0) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', startX - 18);
        text.setAttribute('y', y + 3);
        text.setAttribute('class', 'string-nut-indicator open');
        text.textContent = '○';
        svg.appendChild(text);
      } else if (fret > 0 && fret <= numFrets) {
        const xPrev = fretX[fret - 1];
        const xCurr = fretX[fret];
        const xCenter = (xPrev + xCurr) / 2;

        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'fret-dot-group');

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', xCenter);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', 10);
        
        const noteName = voicing.notes[stringIndex];
        const isRoot = noteName === state.chord.rootNote;
        
        if (isRoot) {
          circle.setAttribute('class', 'fret-dot-circle root');
        } else {
          circle.setAttribute('class', 'fret-dot-circle');
        }
        
        group.appendChild(circle);

        const fingerNum = voicing.fingers[stringIndex];
        const fingerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        fingerText.setAttribute('x', xCenter);
        fingerText.setAttribute('y', y);
        
        if (isRoot) {
          fingerText.setAttribute('class', 'fret-dot-text root');
          fingerText.textContent = 'R';
        } else {
          fingerText.setAttribute('class', 'fret-dot-text');
          fingerText.textContent = fingerNum > 0 ? fingerNum : '';
        }
        
        group.appendChild(fingerText);

        group.addEventListener('click', (e) => {
          e.stopPropagation();
          const midi = voicing.midiNotes[stringIndex];
          if (midi !== -1) playNote(midi, 0, 0.7);
        });

        svg.appendChild(group);
      }
    });
  }

  // 7. Render transparent overlay boxes for interactive note play (fretboard explorer)
  for (let s = 0; s < 6; s++) {
    const y = stringY[s];
    const stringMidiBase = OPEN_STRING_MIDI[s];

    // Open string trigger area
    const openTrigger = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    openTrigger.setAttribute('x', startX - 40);
    openTrigger.setAttribute('y', y - 10);
    openTrigger.setAttribute('width', 32);
    openTrigger.setAttribute('height', 20);
    openTrigger.setAttribute('class', 'fret-trigger-rect');
    openTrigger.addEventListener('click', () => {
      initAudio();
      playNote(stringMidiBase, 0, 0.6);
    });
    svg.appendChild(openTrigger);

    // Fretted trigger areas
    for (let f = 1; f <= numFrets; f++) {
      const xPrev = fretX[f - 1];
      const xCurr = fretX[f];
      
      const trigger = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      trigger.setAttribute('x', xPrev);
      trigger.setAttribute('y', y - 10);
      trigger.setAttribute('width', xCurr - xPrev);
      trigger.setAttribute('height', 20);
      trigger.setAttribute('class', 'fret-trigger-rect');
      
      trigger.addEventListener('click', () => {
        initAudio();
        playNote(stringMidiBase + f, 0, 0.6);
      });
      svg.appendChild(trigger);
    }
  }
}

// --- Chord Play Function ---
function triggerCurrentChordStrum() {
  const internalFlavor = getChordFlavor(state.chord.quality, state.chord.extension);
  const voicings = getChordVoicings(state.chord.rootNote, internalFlavor);
  const activeVoicing = voicings[state.chord.voicingIndex];
  if (activeVoicing) {
    triggerChordStrum(activeVoicing.midiNotes);
  }
}

function triggerChordStrum(midiNotes) {
  const vol = parseFloat(document.getElementById('volume-slider').value);
  playChord(midiNotes, 60, vol * 0.7);
}

// --- Render Circle of Fifths Wheel SVG ---
function renderCircleOfFifths() {
  const svg = document.getElementById('circle-fifths-svg');
  svg.innerHTML = '';

  const outerRadius = 175;
  const midRadius = 118;
  const innerRadius = 62;
  
  const outerBorder = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  outerBorder.setAttribute('cx', 0);
  outerBorder.setAttribute('cy', 0);
  outerBorder.setAttribute('r', outerRadius);
  outerBorder.setAttribute('class', 'circle-rim');
  svg.appendChild(outerBorder);

  for (let i = 0; i < 12; i++) {
    const angleCenter = -Math.PI / 2 + i * (2 * Math.PI / 12);
    const angleStart = angleCenter - Math.PI / 12;
    const angleEnd = angleCenter + Math.PI / 12;

    // Outer Ring: Major Keys
    const majKey = CIRCLE_KEYS_MAJOR[i];
    const pathMaj = createAnnularSectorPath(0, 0, midRadius, outerRadius, angleStart, angleEnd);
    
    const sectorMaj = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    sectorMaj.setAttribute('d', pathMaj);
    sectorMaj.setAttribute('class', 'circle-sector major');
    sectorMaj.id = `circle-sector-major-${majKey.replace('#', 'sharp')}`;
    
    sectorMaj.addEventListener('click', () => {
      initAudio();
      selectCircleKey(majKey);
    });
    svg.appendChild(sectorMaj);

    const textRadMaj = (midRadius + outerRadius) / 2;
    const textXMaj = textRadMaj * Math.cos(angleCenter);
    const textYMaj = textRadMaj * Math.sin(angleCenter);
    
    const labelMaj = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelMaj.setAttribute('x', textXMaj);
    labelMaj.setAttribute('y', textYMaj);
    labelMaj.setAttribute('class', 'circle-text');
    labelMaj.textContent = majKey;
    svg.appendChild(labelMaj);

    // Inner Ring: Relative Minor Keys
    const minKey = CIRCLE_KEYS_MINOR[i];
    const pathMin = createAnnularSectorPath(0, 0, innerRadius, midRadius, angleStart, angleEnd);
    
    const sectorMin = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    sectorMin.setAttribute('d', pathMin);
    sectorMin.setAttribute('class', 'circle-sector minor');
    sectorMin.id = `circle-sector-minor-${minKey.replace('#', 'sharp')}`;
    
    sectorMin.addEventListener('click', () => {
      initAudio();
      selectCircleKey(minKey);
    });
    svg.appendChild(sectorMin);

    const textRadMin = (innerRadius + midRadius) / 2;
    const textXMin = textRadMin * Math.cos(angleCenter);
    const textYMin = textRadMin * Math.sin(angleCenter);
    
    const labelMin = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelMin.setAttribute('x', textXMin);
    labelMin.setAttribute('y', textYMin);
    labelMin.setAttribute('class', 'circle-text minor');
    labelMin.textContent = minKey;
    svg.appendChild(labelMin);
  }

  const midBorder = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  midBorder.setAttribute('cx', 0);
  midBorder.setAttribute('cy', 0);
  midBorder.setAttribute('r', midRadius);
  midBorder.setAttribute('class', 'circle-divider');
  svg.appendChild(midBorder);

  const innerBorder = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  innerBorder.setAttribute('cx', 0);
  innerBorder.setAttribute('cy', 0);
  innerBorder.setAttribute('r', innerRadius);
  innerBorder.setAttribute('class', 'circle-divider');
  svg.appendChild(innerBorder);

  const centerHub = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  centerHub.setAttribute('cx', 0);
  centerHub.setAttribute('cy', 0);
  centerHub.setAttribute('r', innerRadius);
  centerHub.setAttribute('style', 'fill: var(--card-bg);');
  svg.appendChild(centerHub);

  const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  centerText.setAttribute('x', 0);
  centerText.setAttribute('y', 0);
  centerText.setAttribute('style', "font-family: var(--font-serif); font-size: 10px; font-weight: bold; fill: var(--text-muted); text-anchor: middle; dominant-baseline: middle; text-transform: uppercase; letter-spacing: 0.1em;");
  centerText.textContent = "5ths";
  svg.appendChild(centerText);

  highlightActiveCircleSector();
}

function createAnnularSectorPath(cx, cy, rInner, rOuter, startAngle, endAngle) {
  const x1Outer = cx + rOuter * Math.cos(startAngle);
  const y1Outer = cy + rOuter * Math.sin(startAngle);
  const x2Outer = cx + rOuter * Math.cos(endAngle);
  const y2Outer = cy + rOuter * Math.sin(endAngle);

  const x1Inner = cx + rInner * Math.cos(endAngle);
  const y1Inner = cy + rInner * Math.sin(endAngle);
  const x2Inner = cx + rInner * Math.cos(startAngle);
  const y2Inner = cy + rInner * Math.sin(startAngle);

  const largeArcFlag = (endAngle - startAngle) > Math.PI ? 1 : 0;

  return `
    M ${x1Outer} ${y1Outer}
    A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}
    L ${x1Inner} ${y1Inner}
    A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${x2Inner} ${y2Inner}
    Z
  `;
}

// --- Circle Actions & Key Detail Management ---

function selectCircleKey(keyName) {
  state.circle.selectedKey = keyName;
  highlightActiveCircleSector();
  updateCircleDetails();
  playCircleAudio(keyName);
}

function highlightActiveCircleSector() {
  document.querySelectorAll('.circle-sector').forEach(sec => sec.classList.remove('active'));

  const isMinor = state.circle.selectedKey.endsWith('m');
  const cleanId = state.circle.selectedKey.replace('#', 'sharp');
  const selector = isMinor 
    ? `#circle-sector-minor-${cleanId}` 
    : `#circle-sector-major-${cleanId}`;
  
  const element = document.querySelector(selector);
  if (element) {
    element.classList.add('active');
  }
}

function updateCircleDetails() {
  const details = getKeyDetails(state.circle.selectedKey);

  const displayTitle = details.isMinor ? `${details.keyName} Key (Relative Minor)` : `${details.keyName} Key (Major)`;
  document.getElementById('info-key-name').textContent = displayTitle;
  document.getElementById('info-key-signature').textContent = details.signature;

  const listContainer = document.getElementById('diatonic-chords-list');
  listContainer.innerHTML = '';

  details.diatonicChords.forEach(item => {
    const row = document.createElement('tr');
    row.className = 'diatonic-row';
    row.id = `diatonic-row-${item.degree}`;

    row.innerHTML = `
      <td>
        <button class="diatonic-play-btn" aria-label="Play chord" id="btn-play-diatonic-${item.degree}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </button>
      </td>
      <td class="diatonic-degree">${item.degree}</td>
      <td class="diatonic-chord-name" style="font-weight: 600;">
        ${item.note}${item.flavor === 'Minor' ? 'm' : item.flavor === 'Diminished' ? '°' : ''}
      </td>
      <td>${item.flavor}</td>
      <td>
        <select class="diatonic-select" id="select-ext-${item.degree}" aria-label="Select chord extension">
          <option value="normal">Triad</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="9">9</option>
          <option value="13">13</option>
          <option value="b5">b5</option>
          <option value="b9">b9</option>
          <option value="#9">#9</option>
          <option value="#5">#5</option>
        </select>
      </td>
      <td style="text-align: right;">
        <button class="filter-btn" id="btn-explore-diatonic-${item.degree}" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;">
          Explore &rarr;
        </button>
      </td>
    `;

    // Retrieve references
    const playBtn = row.querySelector(`#btn-play-diatonic-${item.degree}`);
    const select = row.querySelector(`#select-ext-${item.degree}`);
    const exploreBtn = row.querySelector(`#btn-explore-diatonic-${item.degree}`);

    // In-place play event
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      initAudio();
      playDiatonicInPlace(item.note, item.flavor, select.value);
    });

    // Dropdown change plays instantly in-place
    select.addEventListener('change', (e) => {
      initAudio();
      playDiatonicInPlace(item.note, item.flavor, e.target.value);
    });

    // Explore routes user to Fretboard tab
    exploreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      initAudio();
      
      // Update Chord Explorer inputs
      state.chord.rootNote = item.note;
      state.chord.quality = item.flavor;
      state.chord.extension = select.value;
      state.chord.voicingIndex = 0;

      // Re-render active selectors in sidebar
      updateRootNoteSelection();
      
      // Update Quality list active state
      document.querySelectorAll('#chord-quality-list .flavor-btn').forEach(btn => {
        if (btn.id === `btn-quality-${state.chord.quality}`) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update Extension active state
      document.querySelectorAll('#chord-extension-grid .note-btn').forEach(btn => {
        if (btn.id === `btn-extension-${state.chord.extension}`) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update explorer details and switch views
      updateChordExplorer();
      switchSubTab('subtab-visualizer');
      switchTab('chord-explorer-view');
      
      // Strum newly loaded chord automatically on big fretboard
      triggerCurrentChordStrum();
    });

    listContainer.appendChild(row);
  });
}

function playDiatonicInPlace(note, quality, extension) {
  const flavor = getChordFlavor(quality, extension);
  const voicings = getChordVoicings(note, flavor);
  if (voicings.length > 0) {
    triggerChordStrum(voicings[0].midiNotes);
  }
}

function playCircleAudio(keyName) {
  const isMinor = keyName.endsWith('m');
  const root = isMinor ? keyName.slice(0, -1) : keyName;
  const rootNoteNum = getNoteChromaticNumber(normalizeNoteName(root));
  const vol = parseFloat(document.getElementById('volume-slider').value);

  if (state.circle.playMode === 'note') {
    const midiNote = 48 + rootNoteNum;
    playNote(midiNote, 0, vol * 0.7);
  } else {
    const flavor = isMinor ? 'Minor' : 'Major';
    const voicings = getChordVoicings(root, flavor);
    
    if (voicings.length > 0) {
      triggerChordStrum(voicings[0].midiNotes);
    } else {
      const thirdOffset = isMinor ? 3 : 4;
      const fifthOffset = 7;
      const midiNotes = [
        48 + rootNoteNum,
        48 + rootNoteNum + thirdOffset,
        48 + rootNoteNum + fifthOffset
      ];
      playChord(midiNotes, 70, vol * 0.6);
    }
  }
}
