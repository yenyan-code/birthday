/**
 * main.js — Core Game Loop, State Machine & Input Orchestrator
 * Dagan Bai!
 */

import { GameEngine } from './engine.js';
import { BirthdaySurprise } from './surprise.js';

// Game States
const STATE = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  SUSPENSE: 'SUSPENSE', // 2-second freeze
  SURPRISE: 'SURPRISE'  // Confetti explosion & grand birthday banner
};

class GameApp {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.engine = new GameEngine(this.canvas);
    this.surprise = new BirthdaySurprise(this.canvas);

    this.state = STATE.MENU;
    this.lastTime = 0;
    this.highScore = parseInt(localStorage.getItem('dagan_bai_highscore') || '0', 10);

    // DOM Overlays & HUD
    this.modalStart = document.getElementById('modal-start');
    this.hudScore = document.getElementById('hud-score');
    this.hudDistance = document.getElementById('hud-distance');
    this.hudCoins = document.getElementById('hud-coins');
    this.hudHighscore = document.getElementById('hud-highscore');

    this.btnStart = document.getElementById('btn-start');
    this.btnReplay = document.getElementById('btn-replay');

    this._bindEvents();
    this._updateHUD();

    // Start render loop
    requestAnimationFrame((t) => this._loop(t));
  }

  _bindEvents() {
    // 1. Keyboard Controls
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        this._startPlaying();
        return;
      }

      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        this._handleActionInput();
      } else if (e.code === 'Enter') {
        if (this.state === STATE.MENU || this.state === STATE.SURPRISE) {
          e.preventDefault();
          this._startPlaying();
        }
      }
    });

    // 2. Touch & Tap Controls (Mobile & Tablet)
    const handleTouch = (e) => {
      // Don't intercept button clicks inside modals
      if (e.target.closest('button')) return;
      e.preventDefault();
      this._handleActionInput();
    };

    this.canvas.addEventListener('touchstart', handleTouch, { passive: false });
    this.canvas.addEventListener('mousedown', handleTouch);

    // 3. UI Buttons
    this.btnStart?.addEventListener('click', () => this._startPlaying());
    this.btnReplay?.addEventListener('click', () => this._startPlaying());

    // 4. Window Visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state === STATE.PLAYING) {
        this.engine.isPaused = true;
      } else if (!document.hidden && this.state === STATE.PLAYING) {
        this.engine.isPaused = false;
        this.lastTime = performance.now();
      }
    });
  }

  _handleActionInput() {
    if (this.state === STATE.MENU) {
      this._startPlaying();
    } else if (this.state === STATE.PLAYING) {
      const jumped = this.engine.triggerJump();
      if (jumped) {
        this.surprise.playJump();
      }
    } else if (this.state === STATE.SURPRISE) {
      this._startPlaying();
    }
  }

  _startPlaying() {
    this.state = STATE.PLAYING;
    this.engine.reset();
    this.surprise.stop();

    this.modalStart?.classList.add('hidden');
    this.lastTime = performance.now();
  }

  _handleCollision(obstacle) {
    this.state = STATE.SUSPENSE;
    this.engine.isPaused = true;

    // Check & save High Score
    if (this.engine.score > this.highScore) {
      this.highScore = this.engine.score;
      localStorage.setItem('dagan_bai_highscore', this.highScore.toString());
    }

    // Launch the 2-second comedic suspense sequence
    this.surprise.startSuspenseSequence(
      {
        distance: this.engine.distance,
        coins: this.engine.coins,
        score: this.engine.score
      },
      () => {
        // Confetti explosion & grand birthday banner revealed
        this.state = STATE.SURPRISE;
      }
    );
  }

  _updateHUD() {
    if (this.hudScore) this.hudScore.textContent = `${Math.max(0, this.engine.score)}`;
    if (this.hudDistance) this.hudDistance.textContent = `${Math.max(0, Math.floor(this.engine.distance))}m`;
    if (this.hudCoins) this.hudCoins.textContent = `₱${Math.max(0, this.engine.coins)}`;
    if (this.hudHighscore) this.hudHighscore.textContent = `${Math.max(0, this.highScore)}`;
  }

  _loop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    // 1. Logic Update
    if (this.state === STATE.PLAYING) {
      this.engine.update(dt);
      this._updateHUD();

      // Check collisions
      const result = this.engine.checkCollisions();
      if (result.hit) {
        this._handleCollision(result.obstacle);
      } else if (result.coinCollected) {
        this.surprise.playCoin();
        this._updateHUD();
      }
    } else if (this.state === STATE.MENU) {
      // Gentle idle animation on menu
      this.engine.parallax.roadOffset = (this.engine.parallax.roadOffset + 40 * dt) % 60;
    }

    // Update & render celebratory confetti physics across fullscreen overlay
    if (this.surprise.isConfettiActive) {
      this.surprise.updateConfetti(dt);
      this.surprise.renderConfetti();
    }

    // 2. Render Runner Canvas Frame
    this.engine.render();

    requestAnimationFrame((t) => this._loop(t));
  }
}

// Boot the application safely
function boot() {
  window.__gameApp = new GameApp();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
