const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// canvas settings
ctx.fillStyle = "white";
ctx.strokeStyle = "white";
ctx.lineWidth = 1;

class Particle {
  constructor(effect) {
    this.effect = effect;
    this.x = Math.floor(Math.random() * this.effect.width);
    this.y = Math.floor(Math.random() * this.effect.height);
    this.speedX;
    this.speedY;
    this.speedModifier = Math.floor(Math.random() * 4) + 1;
    this.history = [{ x: this.x, y: this.y }];
    this.maxLength = Math.floor(Math.random() * 300 + 20);
    this.timer = this.maxLength * 2;

    this.colours = ["#8500be", "#ad009e", "#c2007e", "#cb0061", "#cb0049"];
    this.colour = this.colours[Math.floor(Math.random() * this.colours.length)];
  }

  draw(context) {
    context.beginPath();
    context.moveTo(this.history[0].x, this.history[0].y);
    for (let i = 1; i < this.history.length; i++) {
      context.lineTo(this.history[i].x, this.history[i].y);
    }
    context.strokeStyle = this.colour;
    context.stroke();
  }

  update() {
    this.timer--;

    if (this.timer >= 1) {
      let x = Math.floor(this.x / this.effect.cellSize);
      let y = Math.floor(this.y / this.effect.cellSize);
      let index = y * this.effect.cols + x;
      this.angle = this.effect.flowField[index];

      this.speedX = Math.cos(this.angle) * this.speedModifier;
      this.speedY = Math.sin(this.angle) * this.speedModifier;
      this.x += this.speedX;
      this.y += this.speedY;

      this.history.push({ x: this.x, y: this.y });
      if (this.history.length > this.maxLength) {
        this.history.shift();
      }
    } else if (this.history.length > 1) {
      this.history.shift();
    } else {
      this.reset();
    }
  }
  reset() {
    this.x = Math.floor(Math.random() * this.effect.width);
    this.y = Math.floor(Math.random() * this.effect.height);
    this.history = [{ x: this.x, y: this.y }];
    this.timer = this.maxLength * 2;
  }
}

class Effect {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.particles = [];
    this.numberOfParticles = 2000;
    this.cellSize = 10;
    this.rows;
    this.cols;
    this.flowField = [];
    this.curve = 2.2;
    this.zoom = 0.04;
    this.debug = false;
    this.init();

    window.addEventListener("keydown", (e) => {
      if (e.key === "d") this.debug = !this.debug;
    });

    window.addEventListener("resize", (e) => {
      this.resize(e.target.innerWidth, e.target.innerHeight);
    });
  }

  init() {
    // flow field
    this.rows = Math.floor(this.height / this.cellSize);
    this.cols = Math.floor(this.width / this.cellSize);
    this.flowField = [];
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let angle =
          (Math.cos(x * this.zoom) + Math.sin(y * this.zoom)) * this.curve;
        this.flowField.push(angle);
      }
    }

    // particles
    this.particles = [];
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this));
    }
  }

  drawGrid(context) {
    context.save();
    context.strokeStyle = "white";
    context.lineWidth = 0.3;
    for (let r = 0; r < this.rows; r++) {
      const currentR = Math.floor(r * this.cellSize);
      context.beginPath();
      context.moveTo(0, currentR);
      context.lineTo(this.width, currentR);
      context.stroke();
    }
    for (let c = 0; c < this.cols; c++) {
      const currentC = Math.floor(c * this.cellSize);
      context.beginPath();
      context.moveTo(currentC, 0);
      context.lineTo(currentC, this.height);
      context.stroke();
    }
    context.restore();
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.init();
  }

  render(context) {
    if (this.debug) this.drawGrid(context);
    this.particles.forEach((particle) => {
      particle.update(context);
      particle.draw(context);
    });
  }
}

function init() {
  const effect = new Effect(canvas);

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.render(ctx);
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}

init();
