/**
 * surprise.js — Birthday Surprise Trigger, Suspense Timer & Celebration Sequence
 * Dagan Bai! (Run Brother)
 *
 * 1. Upon player collision, immediately halt the game and display standard
 *    red "GAME OVER" screen ("Patay kang bata ka... 👀").
 * 2. Hold the Game Over state for exactly 2.0 seconds of comedic suspense.
 * 3. Suddenly burst with 240+ animated physics confetti particles.
 * 4. Transition into festive birthday banner ("🎉 SURPRISE! Happy Birthday! You survived another year! 🎂").
 * 5. Play upbeat synthesized 8-bit multi-voice "Happy Birthday" melody via Web Audio API.
 * 6. Provide celebratory "🔄 DAGAN NA SAD! (PLAY AGAIN)" button for instant replay.
 */

export class BirthdaySurprise {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Fullscreen Confetti Canvas Overlay
    this.confettiCanvas = document.getElementById('confetti-canvas');
    this.confettiCtx = this.confettiCanvas ? this.confettiCanvas.getContext('2d') : null;
    this._resizeConfetti();
    window.addEventListener('resize', () => this._resizeConfetti());

    // Web Audio Context & Oscillator Synthesizer
    this.audioCtx = null;
    this.isMuted = false;
    this.isPlayingMusic = false;
    this.activeOscillators = [];
    this.musicGain = null;
    this.suspenseTimer = null;

    // Confetti physics particles
    this.confetti = [];
    this.isConfettiActive = false;

    // DOM Overlays & Elements
    this.modalGameOver = document.getElementById('modal-gameover');
    this.modalSurprise = document.getElementById('modal-surprise');
    this.surpriseHeadline = document.getElementById('surprise-headline');
    this.statDistance = document.getElementById('surprise-stat-distance');
    this.statCoins = document.getElementById('surprise-stat-coins');
    this.statScore = document.getElementById('surprise-stat-score');
    this.btnReplay = document.getElementById('btn-replay');

    // Parse URL parameter ?name=YourName for personalized celebration
    const urlParams = new URLSearchParams(window.location.search);
    this.recipientName = urlParams.get('name') || '';

    // Personalize start screen if name is passed
    const startGreeting = document.getElementById('start-greeting');
    if (startGreeting && this.recipientName) {
      startGreeting.textContent = `🏃 SPECIAL MISSION FOR ${this.recipientName.toUpperCase()}! 🎂`;
    }

    // Color palette for celebratory confetti
    this.confettiColors = [
      '#ff0055', '#ff5500', '#ffcc00', '#33cc33',
      '#00ccff', '#9933ff', '#ff66cc', '#ffffff'
    ];
  }

  _resizeConfetti() {
    if (this.confettiCanvas) {
      this.confettiCanvas.width = window.innerWidth;
      this.confettiCanvas.height = window.innerHeight;
    }
  }

  _initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // ── SOUND SYNTHESIS (HTML5 Web Audio API) ────────────────────────────────

  playJump() {
    if (this.isMuted) return;
    this._initAudio();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(560, now + 0.12);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  playCoin() {
    if (this.isMuted) return;
    this._initAudio();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const playTone = (freq, start, dur) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur);
    };

    playTone(987.77, now, 0.08);        // B5
    playTone(1318.51, now + 0.07, 0.2); // E6
  }

  playCrash() {
    if (this.isMuted) return;
    this._initAudio();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const bufLen = Math.floor(ctx.sampleRate * 0.7);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);

    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.2));
    }

    const src = ctx.createBufferSource();
    const bpf = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    src.buffer = buf;
    bpf.type = 'bandpass';
    bpf.frequency.value = 520;
    bpf.Q.value = 0.9;

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.65);

    src.connect(bpf);
    bpf.connect(gain);
    gain.connect(ctx.destination);

    src.start(now);
  }

  playBirthdayMusic() {
    if (this.isMuted) return;
    this._initAudio();
    if (!this.audioCtx) return;

    // Stop any previously playing music first
    this.stopBirthdayMusic();

    this.isPlayingMusic = true;
    const ctx = this.audioCtx;

    // Master gain node dedicated to birthday music track
    this.musicGain = ctx.createGain();
    this.musicGain.gain.setValueAtTime(1, ctx.currentTime);
    this.musicGain.connect(ctx.destination);

    // Standard Happy Birthday notes in C Major
    const notes = [
      ['G4', 0.75], ['G4', 0.25], ['A4', 1.0], ['G4', 1.0], ['C5', 1.0], ['B4', 2.0],
      ['G4', 0.75], ['G4', 0.25], ['A4', 1.0], ['G4', 1.0], ['D5', 1.0], ['C5', 2.0],
      ['G4', 0.75], ['G4', 0.25], ['G5', 1.0], ['E5', 1.0], ['C5', 1.0], ['B4', 1.0], ['A4', 2.0],
      ['F5', 0.75], ['F5', 0.25], ['E5', 1.0], ['C5', 1.0], ['D5', 1.0], ['C5', 2.5]
    ];

    const freqMap = {
      'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C5': 523.25,
      'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99
    };

    const tempo = 116;
    const beatSec = 60 / tempo;
    let time = ctx.currentTime + 0.15;

    notes.forEach(([note, beats]) => {
      const dur = beats * beatSec;
      const freq = freqMap[note];

      // 1. Chiptune Lead Melody (Triangle wave)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.24, time);
      gain.gain.setValueAtTime(0.24, time + dur * 0.75);
      gain.gain.linearRampToValueAtTime(0.001, time + dur * 0.95);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(time);
      osc.stop(time + dur);
      this.activeOscillators.push(osc);

      // 2. Warm Sub-Bass (Sine wave, one octave lower)
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(freq / 2, time);
      subGain.gain.setValueAtTime(0.12, time);
      subGain.gain.linearRampToValueAtTime(0.001, time + dur * 0.9);

      sub.connect(subGain);
      subGain.connect(this.musicGain);

      sub.start(time);
      sub.stop(time + dur);
      this.activeOscillators.push(sub);

      time += dur;
    });
  }

  stopBirthdayMusic() {
    this.isPlayingMusic = false;

    // 1. Immediately mute and disconnect master music gain
    if (this.musicGain && this.audioCtx) {
      try {
        this.musicGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
        this.musicGain.disconnect();
      } catch (e) {}
      this.musicGain = null;
    }

    // 2. Stop and disconnect all active/scheduled oscillator nodes
    if (this.activeOscillators && this.activeOscillators.length > 0) {
      for (const osc of this.activeOscillators) {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      }
      this.activeOscillators = [];
    }
  }

  // ── THE SUSPENSE & CELEBRATION SEQUENCE ───────────────────────────────────

  /**
   * 1. Plays impact crash sound
   * 2. Displays Game Over screen for exactly 2 seconds of comedic suspense
   * 3. Transitions seamlessly to Birthday Surprise mode:
   *    - Bursts 240+ animated physics confetti particles
   *    - Synthesizes 8-bit Happy Birthday melody
   *    - Unfurls festive Birthday Celebration banner
   *    - Displays distance, coins, and score stats
   *    - Offers instant "DAGAN NA SAD! (PLAY AGAIN)" retry
   */
  startSuspenseSequence(stats, onCelebrationStart) {
    this.playCrash();

    // 1. Show standard Game Over modal ("Patay kang bata ka... 👀")
    this.modalGameOver?.classList.remove('hidden');
    this.modalSurprise?.classList.add('hidden');

    if (this.suspenseTimer) {
      clearTimeout(this.suspenseTimer);
      this.suspenseTimer = null;
    }

    // 2. Exactly 2.0s comedic suspense pause
    this.suspenseTimer = setTimeout(() => {
      this.suspenseTimer = null;

      // Hide Game Over modal
      this.modalGameOver?.classList.add('hidden');

      // Launch celebratory confetti burst & synthesized birthday melody
      this.spawnConfettiBurst(260);
      this.playBirthdayMusic();

      // Format headline with celebrant's name
      if (this.recipientName) {
        this.surpriseHeadline.innerHTML = `🎉 SURPRISE!<br/>Happy Birthday, ${this.recipientName.toUpperCase()}! 🎂`;
      } else {
        this.surpriseHeadline.innerHTML = `🎉 SURPRISE!<br/>Happy Birthday! 🎂`;
      }

      // Display statistics
      if (this.statDistance) this.statDistance.textContent = `${Math.max(0, Math.floor(stats.distance || 0))}m`;
      if (this.statCoins) this.statCoins.textContent = `₱${Math.max(0, stats.coins || 0)}`;
      if (this.statScore) this.statScore.textContent = `${Math.max(0, stats.score || 0)}`;

      // Reveal celebratory greeting modal
      this.modalSurprise?.classList.remove('hidden');

      if (onCelebrationStart) onCelebrationStart();
    }, 2000);
  }

  // ── CONFETTI PARTICLE SYSTEM ──────────────────────────────────────────────

  spawnConfettiBurst(count = 260) {
    this._resizeConfetti();
    this.isConfettiActive = true;
    this.confetti = [];

    const w = this.confettiCanvas ? this.confettiCanvas.width : this.canvas.width;
    const h = this.confettiCanvas ? this.confettiCanvas.height : this.canvas.height;

    for (let i = 0; i < count; i++) {
      this.confetti.push({
        x: w / 2 + (Math.random() - 0.5) * 160,
        y: h * 0.45 + (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.5) * 780,
        vy: -380 - Math.random() * 640,
        size: 7 + Math.random() * 10,
        color: this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 14,
        wobble: Math.random() * 10,
        wobbleSpeed: 4 + Math.random() * 6,
        gravity: 360 + Math.random() * 220,
        drag: 0.985
      });
    }
  }

  updateConfetti(dt) {
    if (!this.isConfettiActive || this.confetti.length === 0) return;

    const delta = Math.min(dt, 0.05);
    const canvasH = this.confettiCanvas ? this.confettiCanvas.height : this.canvas.height;
    const canvasW = this.confettiCanvas ? this.confettiCanvas.width : this.canvas.width;

    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const p = this.confetti[i];
      p.vx *= p.drag;
      p.vy += p.gravity * delta;
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.rotation += p.rotationSpeed;
      p.wobble += p.wobbleSpeed * delta;

      if (p.y > canvasH + 40) {
        if (Math.random() > 0.45) {
          p.y = -20;
          p.x = Math.random() * canvasW;
          p.vy = 80 + Math.random() * 140;
          p.vx = (Math.random() - 0.5) * 100;
        } else {
          this.confetti.splice(i, 1);
        }
      }
    }
  }

  renderConfetti(ctx) {
    const targetCtx = ctx || this.confettiCtx;
    if (!targetCtx) return;

    if (this.confettiCanvas && targetCtx === this.confettiCtx) {
      targetCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
    }

    if (!this.isConfettiActive || this.confetti.length === 0) return;

    targetCtx.save();
    for (const p of this.confetti) {
      targetCtx.save();
      targetCtx.translate(p.x, p.y);
      targetCtx.rotate((p.rotation * Math.PI) / 180);

      const scaleX = Math.cos(p.wobble);
      targetCtx.scale(scaleX, 1);

      targetCtx.fillStyle = p.color;
      targetCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      targetCtx.restore();
    }
    targetCtx.restore();
  }

  stop() {
    // 1. Cancel pending suspense timeout if active
    if (this.suspenseTimer) {
      clearTimeout(this.suspenseTimer);
      this.suspenseTimer = null;
    }

    // 2. Stop Happy Birthday song immediately
    this.stopBirthdayMusic();

    // 3. Clean up confetti particles
    this.isConfettiActive = false;
    this.confetti = [];
    if (this.confettiCtx && this.confettiCanvas) {
      this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
    }

    // 4. Hide all game over and surprise modals
    this.modalGameOver?.classList.add('hidden');
    this.modalSurprise?.classList.add('hidden');
  }
}
