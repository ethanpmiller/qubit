# qubit
Qubit Tetris is a browser-based, classic Tetris clone featuring colorful pieces, persistent high scores, and immersive tone-generated background music and sound effects. Built with modern JavaScript, it emphasizes modularity and clarity, making it easy to understand, customize, and extend.


## Features:

Classic Tetris gameplay with color-coded pieces.
Persistent high score leaderboard stored in localStorage.
Looping background music generated with Web Audio API tones.
Sound effects for move, line clear, and game over, also tone-based.
Modular architecture using separate JavaScript modules for clarity.
Fully playable in modern browsers.


## Overview:

Qubit Tetris is a modern, modular Tetris clone that uses tone-based sound effects and background music. Built with separate JavaScript modules, it is easy to understand, extend, and customize.


## How to Run:

Download or clone the repository.
Open index.html in a modern browser (Chrome, Firefox, Edge).


### Use arrow keys to control:

Left/Right: move pieces
Up: rotate
Down: soft drop
Spacebar: hard drop

Click Restart to start a new game.

High scores are saved automatically; view the leaderboard below the game.


## Customization Tips:

Change the melody by modifying frequencies in startMusic().
Adjust sound effect durations or tones in sound.js.
Add new shapes or colors in shapes.js.
Enhance UI or add animations for better visuals.


## Project Structure:
                          
qubit/
│
├── index.html
├── style.css
├── js/
│   ├── game.js
│   ├── shapes.js
│   ├── sound.js
│   └── ui.js
└── README.md


## Description of Files:

index.html: Main HTML file, loads CSS and JavaScript modules.
style.css: Contains styling for the game UI.
js/game.js: Core game logic, handles game loop, shape movements, collisions.
js/shapes.js: Defines the shapes and rotations.
js/sound.js: Manages tone generation, background music, and sound effects.
js/ui.js: Handles UI updates like score display, leaderboard, controls.
README.md: Project overview, setup instructions, gameplay directions.
