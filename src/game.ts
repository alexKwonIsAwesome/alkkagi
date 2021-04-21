import P5 from 'p5';
import {
  BLACK,
  BOARD_HEIGHT,
  BOARD_IMAGE_URL,
  BOARD_OFFSET_X,
  BOARD_OFFSET_Y,
  BOARD_WIDTH,
  INITIAL_STONES,
  STONE_RADIUS,
} from './constant';
import Stone from './stone';
import { StoneType } from './type';
import {
  capitalizeFirstLetter,
  getPositionByMatrix,
  handleCollision,
} from './utils';

export class Game {
  private s: P5;
  public turn: 'black' | 'white';
  public stones: Stone[];
  public boardImage: P5.Image;

  constructor(sketch: P5) {
    this.s = sketch;
    this.turn = BLACK;
    this.stones = [];
    this.boardImage = this.s.loadImage(BOARD_IMAGE_URL);
  }

  addInitialStones() {
    INITIAL_STONES.forEach(({ row, column, type }) => {
      const { x, y } = getPositionByMatrix(row, column);
      const stone = new Stone(
        this.s,
        this,
        x,
        y,
        STONE_RADIUS,
        type as StoneType,
      );
      this.stones.push(stone);
    });
  }

  handleStoneDeath() {
    this.stones.forEach((stone) => {
      if (
        stone.position.x < BOARD_OFFSET_X ||
        stone.position.x > BOARD_OFFSET_X + BOARD_WIDTH ||
        stone.position.y < BOARD_OFFSET_Y ||
        stone.position.y > BOARD_OFFSET_Y + BOARD_HEIGHT
      ) {
        stone.die();
      }
    });
  }

  handleStoneCollision() {
    for (let i = 0; i < this.stones.length; i += 1) {
      for (let j = i + 1; j < this.stones.length; j += 1) {
        const baseStone = this.stones[i];
        const targetStone = this.stones[j];
        handleCollision(baseStone, targetStone);
      }
    }
  }

  drawCanvas() {
    this.s.createCanvas(800, 800);
  }

  drawBoard() {
    this.s.background(254, 243, 199);
    this.s.image(this.boardImage, 172, 172);
  }

  drawTurnInfo() {
    this.s.textSize(14);
    this.s.textLeading(20);
    this.s.text(`Current Turn: ${capitalizeFirstLetter(this.turn)}`, 336, 700);
  }

  draw() {
    this.drawBoard();
    this.drawTurnInfo();
  }
}
