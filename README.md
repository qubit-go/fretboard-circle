# 🎸 Fretboard & Circle — Guitar Music Theory Lab

An interactive, clean, minimalist guitar theory dashboard designed to help musicians explore chords, alternate voicings, key signatures, and the Circle of Fifths. Play chords and scale degrees with high-fidelity synthesized guitar plucks right in your browser.

🌐 **Live Demo**: [https://qubit-go.github.io/fretboard-circle](https://qubit-go.github.io/fretboard-circle)

---

## ✨ Features

### 1. Interactive Fretboard & Chord Explorer
* **180+ Movable Shapes**: Swept across 19 distinct chord flavors including **Major, Minor, Diminished, Dominant, and Augmented** qualities.
* **Altered Jazz Extensions**: Full support for altered voicings such as **b5, b9, #9, and #5** (e.g. Dominant 7#9, Minor 7b5).
* **Interval Spellers**: Instantly displays correct musical note names, scale formulas, and finger markers for every shape.
* **Strum Synthesizer**: Strum chords or pluck individual strings using a native guitar-pluck synthesizer built on the **Web Audio API** (fully compatible with iOS Safari & Android Chrome).

### 2. Multi-Voicings Comparison
* Switch to the **All 5 Voicings** tab to see and compare up to 5 distinct movable shapes for the selected chord side-by-side in fluid, responsive mini-fretboard cards.

### 3. Interactive Circle of Fifths
* Concentric music theory circle displaying major and relative minor keys.
* **Multi-Mode Playback**: Toggle between playing the single key signature note or the full diatonic key chord on click.
* **Diatonic Scale Reference**: Instantly generates primary diatonic scale degrees (I, ii, iii, IV, V, vi, vii°) with interactive playback and selectable extension dropdowns.

### 4. Responsive & Minimalist Design
* Styled with a premium, warm terracotta and cream color palette.
* Fluid layouts that scale down dynamically, keeping control buttons, sliders, and navigation grids perfectly centered and responsive on all mobile viewports.

---

## 🛠️ Technology Stack

* **Frontend**: Pure HTML5 (Semantic Structure) & ES6 Javascript Modules
* **Styling**: Vanilla CSS3 (Custom design tokens, custom responsive grids, dynamic hover elevations, and flex containers)
* **Audio Engine**: Web Audio API (Synthesizing guitar string physical pluck transients and body resonance)
* **Graphics**: Vector SVGs (Responsive fretboards, finger dots, and key sectors)

---

## 💻 Running Locally

To run the application locally:
1. Clone the repository:
   ```bash
   git clone https://github.com/qubit-go/fretboard-circle.git
   ```
2. Open the directory:
   ```bash
   cd fretboard-circle
   ```
3. Start a local server:
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # Node.js
   npx http-server -p 8000
   ```
4. Open your browser and navigate to **`http://localhost:8000`**.
