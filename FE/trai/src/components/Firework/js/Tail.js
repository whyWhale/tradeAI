import { randomNumBetween } from './utils';

export default class Tail {
  constructor(ctx, x, vy, colorDeg) {
    this.ctx = ctx;
    this.canvasHeight = window.innerHeight;
    this.x = x;
    this.y = this.canvasHeight;
    this.vy = vy;
    this.colorDeg = colorDeg;
    this.angle = randomNumBetween(0, 2);
    this.friction = 0.985;
    this.opacity = 1;
  }

  update() {
    this.vy *= this.friction;
    this.y += this.vy;

    this.angle += 1;
    this.x += Math.cos(this.angle) * this.vy * 0.2;
    this.opacity = -this.vy * 0.1;
  }

  draw() {
    this.ctx.fillStyle = `hsla(${this.colorDeg}, 100%, 65%, ${this.opacity})`;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    this.ctx.fill();
  }
}
