// The clack of a split-flap board, made in the browser with the Web Audio API:
// a very short burst of noise, filtered so it sounds like plastic, not like hiss.
// Nothing is downloaded. The AudioContext is created on the first click,
// because browsers only allow sound after the user has done something.

let audio = null;
let noise = null;

function setUp() {
  if (audio) return true;
  const Context = window.AudioContext || window.webkitAudioContext;
  if (!Context) return false;
  audio = new Context();
  // 30 ms of white noise, fading out
  const length = Math.floor(audio.sampleRate * 0.03);
  noise = audio.createBuffer(1, length, audio.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 4);
  }
  return true;
}

// call it from a click, so the browser lets the sound play later
export function unlockFlapSound() {
  if (setUp() && audio.state === "suspended") audio.resume();
}

// strength: 0-1, how many flaps fell in this moment
export function playFlap(strength = 1) {
  if (!audio || audio.state !== "running") return;
  const source = audio.createBufferSource();
  source.buffer = noise;
  source.playbackRate.value = 0.8 + Math.random() * 0.5;

  const filter = audio.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1800 + Math.random() * 1400;
  filter.Q.value = 1.2;

  const gain = audio.createGain();
  gain.gain.value = 0.05 + 0.12 * Math.min(1, strength);

  source.connect(filter).connect(gain).connect(audio.destination);
  source.start();
}
