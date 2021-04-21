import P5 from 'p5';
import { BLACK, WHITE } from './constant';
import { Game } from './app';
import { StoneType } from './type';

class Stone {
  private sketch: P5;
  private game: Game;
  public mass: number;
  public position: P5.Vector;
  public velocity: P5.Vector;
  public reservedVelocity: P5.Vector | null;
  public radius: number;
  public type: StoneType;
  public isLoading: boolean;

  constructor(
    sketch: P5,
    game: Game,
    x: number,
    y: number,
    radius: number,
    type: StoneType,
  ) {
    this.sketch = sketch;
    this.game = game;
    this.position = this.sketch.createVector(x, y);
    this.velocity = this.sketch.createVector();
    this.reservedVelocity = null;
    this.radius = radius;
    this.mass = radius * 0.1;
    this.type = type;
    this.isLoading = false;
  }

  load() {
    this.isLoading = true;
  }

  shoot() {
    if (!this.reservedVelocity) {
      return;
    }

    this.velocity = this.reservedVelocity;
    this.reservedVelocity = null;
    this.isLoading = false;
  }

  die() {
    const index = this.game.stones.indexOf(this);
    this.game.stones.splice(index, 1);
  }

  handleMousePressed() {
    const distance = this.sketch.dist(
      this.sketch.mouseX,
      this.sketch.mouseY,
      this.position.x,
      this.position.y,
    );
    if (distance < this.radius && this.game.turn === this.type) {
      this.load();
    }
  }

  handleMouseReleased() {
    if (!this.isLoading) {
      return;
    }

    this.shoot();

    if (this.type === WHITE) {
      this.game.turn = BLACK;
    } else if (this.type === BLACK) {
      this.game.turn = WHITE;
    }
  }

  drawStone() {
    this.sketch.push();
    if (this.type === BLACK) {
      this.sketch.noStroke();
      this.sketch.fill(0);
    } else if (this.type === WHITE) {
      this.sketch.stroke(0, 0, 0);
      this.sketch.strokeWeight(1);
      this.sketch.fill(255);
    }

    this.sketch.ellipse(
      this.position.x,
      this.position.y,
      this.radius * 2,
      this.radius * 2,
    );
    this.sketch.pop();

    const acceleration = 0.85;
    const newVelocity = this.velocity.mult(acceleration);
    if (Math.round(newVelocity.x) === 0) {
      newVelocity.x = 0;
    } else if (Math.round(newVelocity.y) === 0) {
      newVelocity.y = 0;
    }
    this.velocity = newVelocity;
    this.position.add(this.velocity);
  }

  drawArrow() {
    if (!this.isLoading) {
      return;
    }

    const maxVectorMagnitude = this.radius * 5;
    this.reservedVelocity = this.sketch
      .createVector(
        (this.sketch.mouseX - this.position.x) * -1,
        (this.sketch.mouseY - this.position.y) * -1,
      )
      .limit(maxVectorMagnitude);

    this.sketch.push();
    this.sketch.stroke(248, 113, 113);
    this.sketch.strokeWeight(3);
    this.sketch.fill(248, 113, 113);
    this.sketch.translate(this.position.x, this.position.y);
    this.sketch.line(0, 0, this.reservedVelocity.x, this.reservedVelocity.y);
    this.sketch.rotate(this.reservedVelocity.heading());
    const arrowSize = 7;
    this.sketch.translate(this.reservedVelocity.mag() - arrowSize, 0);
    this.sketch.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    this.sketch.pop();
  }

  draw() {
    this.drawStone();
    this.drawArrow();
  }
}

export default Stone;
