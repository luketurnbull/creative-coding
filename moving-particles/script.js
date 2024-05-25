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
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.history = [{ x: this.x, y: this.y }];
    this.maxLength = Math.floor(Math.random() * 150 + 10);
  }

  draw(context) {
    context.fillRect(this.x, this.y, 10, 10);
    context.beginPath();
    context.moveTo(this.history[0].x, this.history[0].y);
    for (let i = 1; i < this.history.length; i++) {
      context.lineTo(this.history[i].x, this.history[i].y);
    }
    context.stroke();
  }

  update() {
    if (this.x < 0) {
      this.speedX = Math.abs(this.speedX);
    } else if (this.x > this.effect.width) {
      this.speedX = -Math.abs(this.speedX);
    }

    if (this.y < 0) {
      this.speedY = Math.abs(this.speedY);
    } else if (this.y > this.effect.height) {
      this.speedY = -Math.abs(this.speedY);
    }

    this.x += this.speedX + Math.random() * 15 - 7.25;
    this.y += this.speedY + Math.random() * 15 - 7.25;
    this.history.push({ x: this.x, y: this.y });
    if (this.history.length > this.maxLength) {
      this.history.shift();
    }
  }
}

class Effect {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.particles = [];
    this.numberOfParticles = 50;
    this.init();
  }

  init() {
    // particles
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this));
    }
  }

  render(context) {
    this.particles.forEach((particle) => {
      particle.update(context);
      particle.draw(context);
    });
  }
}

function init() {
  const effect = new Effect(canvas.width, canvas.height);
  effect.render(ctx);

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.render(ctx);
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}

init();

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});
