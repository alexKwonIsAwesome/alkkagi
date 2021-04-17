import P5 from 'p5';

type StoneType = 'white' | 'black';

class Stone {
  private s: P5;
  public mass: number;
  public position: P5.Vector;
  public velocity: P5.Vector;
  public radius: number;
  public type: StoneType;

  public arrowHead: P5.Vector | null;

  public isLoading: boolean;

  constructor(
    sketch: P5,
    x: number,
    y: number,
    radius: number,
    type: StoneType,
  ) {
    this.s = sketch;
    this.position = this.s.createVector(x, y);
    this.velocity = this.s.createVector();
    this.radius = radius;
    this.mass = radius * 0.1;
    this.type = type;

    this.arrowHead = null;

    this.isLoading = false;
  }

  load() {
    this.isLoading = true;
  }

  shoot() {
    if (!this.arrowHead) {
      return;
    }

    this.velocity = this.arrowHead;
    this.isLoading = false;
  }

  drawArrow() {
    this.arrowHead = this.s
      .createVector(
        (this.s.mouseX - this.position.x) * -1,
        (this.s.mouseY - this.position.y) * -1,
      )
      .limit(this.radius * 5);

    this.s.push();
    this.s.stroke(248, 113, 113);
    this.s.strokeWeight(3);
    this.s.fill(248, 113, 113);
    this.s.translate(this.position.x, this.position.y);
    this.s.line(0, 0, this.arrowHead.x, this.arrowHead.y);
    this.s.rotate(this.arrowHead.heading());
    const arrowSize = 7;
    this.s.translate(this.arrowHead.mag() - arrowSize, 0);
    this.s.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    this.s.pop();
  }

  drawStone() {
    this.s.push();
    if (this.type === 'black') {
      this.s.noStroke();
      this.s.fill(0);
    }

    if (this.type === 'white') {
      this.s.stroke(0, 0, 0);
      this.s.strokeWeight(1);
      this.s.fill(255);
    }

    this.s.ellipse(
      this.position.x,
      this.position.y,
      this.radius * 2,
      this.radius * 2,
    );
    this.s.pop();

    // Apply velocity
    const acceleration = 0.85;
    const newVelocity = this.velocity.mult(acceleration);
    if (this.s.round(newVelocity.x) === 0) {
      newVelocity.x = 0;
    }
    if (this.s.round(newVelocity.y) === 0) {
      newVelocity.y = 0;
    }
    this.velocity = newVelocity;
    this.position.add(this.velocity);
  }

  draw() {
    this.drawStone();

    if (this.isLoading) {
      this.drawArrow();
    }
  }
}

export default Stone;
