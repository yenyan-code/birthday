/**
 * engine.js — Physics, Collision, Parallax Scrolling & Procedural Sprite Engine
 * Dagan Bai!
 */

export class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Virtual Internal Resolution (16:9)
    this.width = 960;
    this.height = 540;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Ground plane coordinate
    this.groundY = 440;

    // Game speeds
    this.baseSpeed = 380;
    this.speed = this.baseSpeed;
    this.distance = 0;
    this.score = 0;
    this.coins = 0;

    // Physics parameters
    this.gravity = 1750;
    this.jumpForce = -680;
    this.doubleJumpForce = -580;

    // Entities
    this.player = this._initPlayer();
    this.obstacles = [];
    this.coinsList = [];
    this.floatingTexts = [];
    this.parallax = this._initParallax();

    // Spawning timers
    this.obstacleTimer = 1.4;
    this.coinTimer = 1.0;

    // Active state flags
    this.isPaused = false;
  }

  _initPlayer() {
    return {
      x: 120,
      y: this.groundY - 68,
      width: 48,
      height: 68,
      vy: 0,
      isGrounded: true,
      jumpsRemaining: 2,
      runFrame: 0,
      frameTime: 0,
      state: 'running' // running, jumping, doublejump, dead
    };
  }

  _initParallax() {
    return {
      skyOffset: 0,
      mountainsOffset: 0,
      cityOffset: 0,
      roadOffset: 0
    };
  }

  reset() {
    this.speed = this.baseSpeed;
    this.distance = 0;
    this.score = 0;
    this.coins = 0;
    this.player = this._initPlayer();
    this.obstacles = [];
    this.coinsList = [];
    this.floatingTexts = [];
    this.obstacleTimer = 1.6;
    this.coinTimer = 1.0;
    this.isPaused = false;
  }

  triggerJump() {
    if (this.player.jumpsRemaining > 0) {
      if (this.player.isGrounded) {
        this.player.vy = this.jumpForce;
        this.player.isGrounded = false;
        this.player.state = 'jumping';
      } else {
        // Double Jump
        this.player.vy = this.doubleJumpForce;
        this.player.state = 'doublejump';
      }
      this.player.jumpsRemaining--;
      return true;
    }
    return false;
  }

  update(dt) {
    if (this.isPaused) return;

    // Cap delta time to prevent physics tunneling after pauses
    const delta = Math.min(dt, 0.05);

    // Increase difficulty progressively
    this.distance += this.speed * delta * 0.05;
    this.score = Math.floor(this.distance) + this.coins * 50;
    this.speed = this.baseSpeed + Math.min(320, this.distance * 0.35);

    // 1. Update Player Physics
    this.player.vy += this.gravity * delta;
    this.player.y += this.player.vy * delta;

    if (this.player.y >= this.groundY - this.player.height) {
      this.player.y = this.groundY - this.player.height;
      this.player.vy = 0;
      this.player.isGrounded = true;
      this.player.jumpsRemaining = 2;
      this.player.state = 'running';
    }

    // Player running animation
    this.player.frameTime += delta;
    if (this.player.frameTime > 0.1) {
      this.player.runFrame = (this.player.runFrame + 1) % 4;
      this.player.frameTime = 0;
    }

    // 2. Update Parallax Backgrounds
    this.parallax.skyOffset = (this.parallax.skyOffset + this.speed * 0.12 * delta) % this.width;
    this.parallax.mountainsOffset = (this.parallax.mountainsOffset + this.speed * 0.35 * delta) % this.width;
    this.parallax.cityOffset = (this.parallax.cityOffset + this.speed * 0.65 * delta) % this.width;
    this.parallax.roadOffset = (this.parallax.roadOffset + this.speed * delta) % 60;

    // 3. Spawn & Update Obstacles
    this.obstacleTimer -= delta;
    if (this.obstacleTimer <= 0) {
      this._spawnObstacle();
      // Randomized gap based on speed
      this.obstacleTimer = 1.3 + Math.random() * 1.5;
    }

    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.x -= this.speed * delta;
      if (obs.x + obs.width < -50) {
        this.obstacles.splice(i, 1);
      }
    }

    // 4. Spawn & Update Coins
    this.coinTimer -= delta;
    if (this.coinTimer <= 0) {
      this._spawnCoins();
      this.coinTimer = 2.0 + Math.random() * 2.5;
    }

    for (let i = this.coinsList.length - 1; i >= 0; i--) {
      const c = this.coinsList[i];
      c.x -= this.speed * delta;
      c.animTime = (c.animTime || 0) + delta * 8;
      if (c.x + c.width < -30) {
        this.coinsList.splice(i, 1);
      }
    }

    // 5. Update Floating Texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= 45 * delta;
      ft.life -= delta;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  _spawnObstacle() {
    const types = ['askal', 'tricycle', 'pothole'];
    const chosenType = types[Math.floor(Math.random() * types.length)];

    let obs = {
      type: chosenType,
      x: this.width + 30
    };

    if (chosenType === 'askal') {
      obs.width = 54;
      obs.height = 38;
      obs.y = this.groundY - obs.height;
    } else if (chosenType === 'tricycle') {
      obs.width = 78;
      obs.height = 68;
      obs.y = this.groundY - obs.height;
    } else { // pothole
      obs.width = 50;
      obs.height = 20;
      obs.y = this.groundY - 10;
    }

    this.obstacles.push(obs);
  }

  _spawnCoins() {
    const pattern = Math.random() > 0.5 ? 'arc' : 'line';
    const startX = this.width + 20;
    const count = 3 + Math.floor(Math.random() * 3);

    for (let i = 0; i < count; i++) {
      let cy = this.groundY - 90;
      if (pattern === 'arc') {
        cy = this.groundY - 90 - Math.sin((i / (count - 1)) * Math.PI) * 75;
      }
      this.coinsList.push({
        x: startX + i * 45,
        y: cy,
        width: 24,
        height: 24,
        animTime: Math.random() * 6
      });
    }
  }

  checkCollisions() {
    const p = this.player;
    // Inset player box for forgiving collision feel
    const pBox = {
      x: p.x + 8,
      y: p.y + 6,
      width: p.width - 16,
      height: p.height - 10
    };

    // Check Obstacles
    for (const obs of this.obstacles) {
      const oBox = {
        x: obs.x + 6,
        y: obs.y + 4,
        width: obs.width - 12,
        height: obs.height - 8
      };

      if (this._aabb(pBox, oBox)) {
        return { hit: true, obstacle: obs };
      }
    }

    // Check Coins
    for (let i = this.coinsList.length - 1; i >= 0; i--) {
      const c = this.coinsList[i];
      if (this._aabb(pBox, c)) {
        this.coins++;
        this.floatingTexts.push({
          text: '+50!',
          x: c.x,
          y: c.y,
          life: 0.8
        });
        this.coinsList.splice(i, 1);
        return { coinCollected: true };
      }
    }

    return { hit: false };
  }

  _aabb(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  // ── RENDERING ─────────────────────────────────────────────────────────────

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Parallax Background Layers
    this._renderSky(ctx);
    this._renderMountains(ctx);
    this._renderCityHouses(ctx);
    this._renderRoad(ctx);

    // 2. Draw Obstacles & Coins
    this._renderCoins(ctx);
    this._renderObstacles(ctx);

    // 3. Draw Player
    this._renderPlayer(ctx);

    // 4. Draw Floating Score Numbers
    this._renderFloatingTexts(ctx);
  }

  _renderSky(ctx) {
    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 320);
    skyGrad.addColorStop(0, '#1977cc');
    skyGrad.addColorStop(0.6, '#4da4f0');
    skyGrad.addColorStop(1, '#97d2fb');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, this.width, 320);

    // Drifting pixel clouds
    ctx.fillStyle = '#ffffff';
    const clouds = [
      { x: (120 - this.parallax.skyOffset * 0.4 + this.width) % this.width, y: 45, w: 110, h: 36 },
      { x: (420 - this.parallax.skyOffset * 0.4 + this.width) % this.width, y: 70, w: 140, h: 42 },
      { x: (760 - this.parallax.skyOffset * 0.4 + this.width) % this.width, y: 35, w: 125, h: 38 }
    ];

    clouds.forEach(c => {
      // White top
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(c.x, c.y, c.w, c.h - 8);
      ctx.fillRect(c.x + 15, c.y - 12, c.w * 0.65, 12);
      // Soft shadow base
      ctx.fillStyle = '#b7dcfa';
      ctx.fillRect(c.x, c.y + c.h - 8, c.w, 8);
    });
  }

  _renderMountains(ctx) {
    const offset = this.parallax.mountainsOffset;
    ctx.save();
    ctx.fillStyle = '#3f7842';

    // Repeating rolling hill waves
    for (let i = -1; i <= 2; i++) {
      const bx = i * this.width - offset;
      ctx.beginPath();
      ctx.moveTo(bx, 340);
      ctx.bezierCurveTo(bx + 240, 220, bx + 500, 240, bx + 960, 340);
      ctx.lineTo(bx + 960, 420);
      ctx.lineTo(bx, 420);
      ctx.fill();

      // Coconut palm silhouettes on ridge
      this._renderPalmTree(ctx, bx + 320, 250);
      this._renderPalmTree(ctx, bx + 710, 270);
    }
    ctx.restore();
  }

  _renderPalmTree(ctx, x, y) {
    ctx.fillStyle = '#225528';
    // Trunk
    ctx.fillRect(x, y, 6, 40);
    // Fronds
    ctx.fillRect(x - 22, y - 10, 24, 6);
    ctx.fillRect(x + 4, y - 10, 24, 6);
    ctx.fillRect(x - 16, y - 18, 18, 6);
    ctx.fillRect(x + 4, y - 18, 18, 6);
  }

  _renderCityHouses(ctx) {
    const offset = this.parallax.cityOffset;
    for (let i = -1; i <= 2; i++) {
      const bx = i * this.width - offset;

      // House 1: Sari-sari store
      ctx.fillStyle = '#3a506b';
      ctx.fillRect(bx + 80, 280, 110, 80);
      // Roof (red corrugated iron)
      ctx.fillStyle = '#d94f3d';
      ctx.fillRect(bx + 70, 268, 130, 12);
      // Store counter awning (striped yellow/red)
      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(bx + 95, 305, 45, 8);

      // Power utility post
      ctx.fillStyle = '#555';
      ctx.fillRect(bx + 260, 210, 8, 150);
      ctx.fillRect(bx + 245, 230, 38, 5);

      // House 2: Provincial concrete bungalow
      ctx.fillStyle = '#4c6482';
      ctx.fillRect(bx + 480, 290, 130, 70);
      ctx.fillStyle = '#208573';
      ctx.fillRect(bx + 470, 276, 150, 14);

      // Power lines
      ctx.strokeStyle = 'rgba(30, 30, 30, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(bx + 245, 230);
      ctx.quadraticCurveTo(bx + 450, 255, bx + 700, 230);
      ctx.stroke();
    }
  }

  _renderRoad(ctx) {
    // Sidewalk curb
    ctx.fillStyle = '#999999';
    ctx.fillRect(0, 360, this.width, 16);
    ctx.fillStyle = '#bbbbbb';
    ctx.fillRect(0, 360, this.width, 4);

    // Asphalt road surface
    ctx.fillStyle = '#343a40';
    ctx.fillRect(0, 376, this.width, this.height - 376);

    // Road dashed center line
    ctx.fillStyle = '#ffcc00';
    const dashW = 40;
    const gapW = 35;
    const cycle = dashW + gapW;
    const startX = -this.parallax.roadOffset;

    for (let x = startX; x < this.width + cycle; x += cycle) {
      ctx.fillRect(x, 445, dashW, 8);
    }

    // Road bottom dark rim
    ctx.fillStyle = '#1a1d20';
    ctx.fillRect(0, this.height - 20, this.width, 20);
  }

  _renderPlayer(ctx) {
    const p = this.player;
    ctx.save();
    ctx.translate(p.x, p.y);

    const f = p.runFrame;

    // Head / Face (warm skin tone)
    ctx.fillStyle = '#f8c291';
    ctx.fillRect(16, 6, 20, 20);

    // Hair (black spiked hair)
    ctx.fillStyle = '#1e272e';
    ctx.fillRect(14, 2, 24, 8);
    ctx.fillRect(12, 6, 6, 10);
    ctx.fillRect(34, 4, 6, 6);

    // Eye (facing right)
    ctx.fillStyle = '#1e272e';
    ctx.fillRect(28, 12, 4, 4);

    // Smile / expression
    ctx.fillStyle = '#d63031';
    ctx.fillRect(26, 20, 6, 2);

    // Torso / Shirt (Vibrant Filipino yellow sando)
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(14, 26, 24, 22);

    // Red print on sando
    ctx.fillStyle = '#e84118';
    ctx.fillRect(22, 32, 8, 8);

    // Arms
    ctx.fillStyle = '#f8c291';
    if (p.state === 'jumping' || p.state === 'doublejump') {
      ctx.fillRect(6, 22, 10, 6); // raised back arm
      ctx.fillRect(36, 18, 10, 6); // raised front arm
    } else {
      const armSwing = Math.sin(f * Math.PI / 2) * 6;
      ctx.fillRect(8, 28 + armSwing, 8, 6);
      ctx.fillRect(34, 28 - armSwing, 8, 6);
    }

    // Shorts (Blue denim)
    ctx.fillStyle = '#227093';
    ctx.fillRect(14, 48, 24, 10);

    // Legs & Slippers (Tsinelas)
    ctx.fillStyle = '#f8c291';
    if (p.state === 'jumping') {
      // Leg jump stretch
      ctx.fillRect(14, 58, 8, 8);
      ctx.fillRect(28, 56, 8, 6);
      ctx.fillStyle = '#e74c3c'; // red slippers
      ctx.fillRect(12, 64, 12, 4);
      ctx.fillRect(26, 60, 12, 4);
    } else {
      // Running legs cycle
      const legOffsets = [
        { l1: 0, l2: 8 },
        { l1: 4, l2: 4 },
        { l1: 8, l2: 0 },
        { l1: 4, l2: 4 }
      ][f];

      ctx.fillRect(14, 56 + legOffsets.l1, 8, 8);
      ctx.fillRect(26, 56 + legOffsets.l2, 8, 8);

      // Red flip-flops / slippers
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(12, 64 + legOffsets.l1, 12, 4);
      ctx.fillRect(24, 64 + legOffsets.l2, 12, 4);
    }

    ctx.restore();
  }

  _renderObstacles(ctx) {
    for (const obs of this.obstacles) {
      ctx.save();
      ctx.translate(obs.x, obs.y);

      if (obs.type === 'askal') {
        this._drawAskal(ctx);
      } else if (obs.type === 'tricycle') {
        this._drawTricycle(ctx);
      } else {
        this._drawPothole(ctx);
      }

      ctx.restore();
    }
  }

  _drawAskal(ctx) {
    // Body (tan brown street dog)
    ctx.fillStyle = '#b7791f';
    ctx.fillRect(10, 12, 34, 18);

    // Head
    ctx.fillRect(36, 4, 16, 16);
    // Ears (perked up)
    ctx.fillRect(38, 0, 6, 6);

    // Snout / Nose
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(50, 10, 5, 4);
    // Eye
    ctx.fillRect(44, 7, 3, 3);

    // Wagging tail
    ctx.fillStyle = '#975a16';
    ctx.fillRect(2, 6, 10, 5);

    // Legs
    ctx.fillStyle = '#834c11';
    ctx.fillRect(12, 30, 6, 8);
    ctx.fillRect(20, 30, 6, 8);
    ctx.fillRect(34, 30, 6, 8);
    ctx.fillRect(40, 30, 6, 8);

    // Red collar
    ctx.fillStyle = '#e53e3e';
    ctx.fillRect(35, 14, 4, 10);
  }

  _drawTricycle(ctx) {
    // Motorcycle Body (Blue)
    ctx.fillStyle = '#2b6cb0';
    ctx.fillRect(8, 28, 30, 22);

    // Wheels (Black)
    ctx.fillStyle = '#1a202c';
    ctx.beginPath();
    ctx.arc(16, 56, 12, 0, Math.PI * 2);
    ctx.arc(64, 56, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e2e8f0'; // rims
    ctx.beginPath();
    ctx.arc(16, 56, 5, 0, Math.PI * 2);
    ctx.arc(64, 56, 5, 0, Math.PI * 2);
    ctx.fill();

    // Sidecar passenger cab (Stainless steel silver)
    ctx.fillStyle = '#cbd5e0';
    ctx.fillRect(36, 20, 38, 34);

    // Sidecar Roof (Bright red canopy)
    ctx.fillStyle = '#e53e3e';
    ctx.fillRect(30, 8, 48, 10);

    // Roof poles
    ctx.fillStyle = '#718096';
    ctx.fillRect(32, 16, 4, 16);
    ctx.fillRect(72, 16, 4, 16);

    // Windshield
    ctx.fillStyle = '#63b3ed';
    ctx.fillRect(66, 24, 7, 14);

    // Headlight (Glowing yellow)
    ctx.fillStyle = '#f6e05e';
    ctx.fillRect(0, 32, 6, 8);
  }

  _drawPothole(ctx) {
    // Road hole oval
    ctx.fillStyle = '#1a202c';
    ctx.beginPath();
    ctx.ellipse(25, 12, 22, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Crack lines around hole
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(3, 10);
    ctx.lineTo(8, 6);
    ctx.moveTo(42, 14);
    ctx.lineTo(48, 18);
    ctx.stroke();

    // Mini construction warning cone
    ctx.fillStyle = '#dd6b20';
    ctx.beginPath();
    ctx.moveTo(36, 0);
    ctx.lineTo(31, 14);
    ctx.lineTo(41, 14);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillRect(33, 6, 6, 3);
  }

  _renderCoins(ctx) {
    for (const c of this.coinsList) {
      ctx.save();
      ctx.translate(c.x + c.width / 2, c.y + c.height / 2);

      // Spinning 3D coin squeeze animation
      const scaleX = Math.abs(Math.sin(c.animTime));
      ctx.scale(scaleX, 1);

      // Gold coin rim
      ctx.fillStyle = '#d69e2e';
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();

      // Shiny center
      ctx.fillStyle = '#ecc94b';
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();

      // Peso symbol (₱)
      if (scaleX > 0.4) {
        ctx.fillStyle = '#744210';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('₱', 0, 0);
      }

      ctx.restore();
    }
  }

  _renderFloatingTexts(ctx) {
    ctx.save();
    ctx.font = "bold 13px 'Press Start 2P', monospace";
    ctx.fillStyle = '#ffcc00';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 4;

    for (const ft of this.floatingTexts) {
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.restore();
  }
}
