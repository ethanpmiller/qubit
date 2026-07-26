// Tone generator and background music
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export function playTone(frequency, duration=200) {
  if(audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  gainNode.gain.value = 0.2;

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  setTimeout(() => oscillator.stop(), duration);
}

let musicInterval = null;
export function startMusic() {
  const notes = [261.63, 293.66, 329.63, 349.23];
  let index = 0;
  if(musicInterval) clearInterval(musicInterval);
  musicInterval = setInterval(() => {
    playTone(notes[index], 400);
    index = (index + 1) % notes.length;
  }, 500);
}

export function playMove() { playTone(440, 100); }
export function playLineClear() { playTone(880, 150); }
export function playGameOver() { playTone(220, 300); }
