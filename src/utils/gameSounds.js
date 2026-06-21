function playGameOverSound(outcome) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.28, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const schedules = {
      // Win: bright ascending fanfare
      win: [
        { freq: 523.25, start: 0.0, dur: 0.18, type: "triangle", gain: 0.9 },
        { freq: 659.25, start: 0.16, dur: 0.18, type: "triangle", gain: 0.9 },
        { freq: 783.99, start: 0.32, dur: 0.18, type: "triangle", gain: 0.9 },
        { freq: 1046.5, start: 0.48, dur: 0.4, type: "triangle", gain: 1.0 },
        // harmony layer
        { freq: 659.25, start: 0.48, dur: 0.4, type: "sine", gain: 0.5 },
      ],
      // Loss: heavy descending toll
      lose: [
        { freq: 220.0, start: 0.0, dur: 0.55, type: "sawtooth", gain: 0.6 },
        { freq: 174.61, start: 0.45, dur: 0.55, type: "sawtooth", gain: 0.6 },
        { freq: 130.81, start: 0.9, dur: 0.7, type: "sawtooth", gain: 0.7 },
      ],
      // Draw: neutral resolution
      draw: [
        { freq: 440.0, start: 0.0, dur: 0.25, type: "sine", gain: 0.7 },
        { freq: 523.25, start: 0.2, dur: 0.25, type: "sine", gain: 0.7 },
        { freq: 493.88, start: 0.4, dur: 0.45, type: "sine", gain: 0.8 },
      ],
    };

    const notes = schedules[outcome] ?? schedules.draw;
    const now = ctx.currentTime;

    for (const note of notes) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = note.type;
      osc.frequency.setValueAtTime(note.freq, now + note.start);
      g.gain.setValueAtTime(0, now + note.start);
      g.gain.linearRampToValueAtTime(note.gain, now + note.start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, now + note.start + note.dur);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(now + note.start);
      osc.stop(now + note.start + note.dur + 0.05);
    }

    // Auto-close context after all sounds finish
    const maxEnd = Math.max(...notes.map((n) => n.start + n.dur)) + 0.3;
    setTimeout(() => ctx.close(), (now + maxEnd) * 1000);
  } catch {
    // AudioContext not available — silently skip
  }
}

export default playGameOverSound;
