export default class Spark {
  constructor(ctx, x, y, vx, vy, opacity, colorDeg) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.opacity = opacity;
    this.colorDeg = colorDeg;
  }

  update() {
    this.opacity -= 0.01;
    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    this.ctx.fillStyle = `hsla(${this.colorDeg}, 100%, 65%, ${this.opacity})`;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
    this.ctx.fill();
  }
}
