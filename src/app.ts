import P5 from 'p5';
import Stone from './stone';
import {
  capitalizeFirstLetter,
  getPositionByMatrix,
  handleCollision,
} from './utils';

export const BOARD_OFFSET_X = 172;
export const BOARD_OFFSET_Y = 172;
export const BOARD_WIDTH = 456;
export const BOARD_HEIGHT = 456;

const WHITE = 'white';
const BLACK = 'black';

// 행렬에서 한 쌍을 영어로 뭐라고 하지? 그 쌍의 복수형으로 이름을 지어야 할 듯
const INITIAL_STONE_TUPLES = [
  [4, 4],
  [4, 7],
  [4, 10],
  [4, 13],
  [4, 16],
  [16, 4],
  [16, 7],
  [16, 10],
  [16, 13],
  [16, 16],
];

new P5((sketch: P5) => {
  const s = sketch;

  let turn = BLACK;

  let stones = INITIAL_STONE_TUPLES.map(([row, col], i) => {
    const { x, y } = getPositionByMatrix(row, col);
    const stone = new Stone(s, x, y, 12, i < 5 ? WHITE : BLACK);
    return stone;
  });

  s.setup = () => {
    s.createCanvas(800, 800);
  };

  s.draw = () => {
    s.background(254, 243, 199);
    s.image(image, 172, 172);

    s.textSize(14);
    s.textLeading(20);
    s.text(`Current Turn: ${capitalizeFirstLetter(turn)}`, 336, 700);

    stones.forEach((stone) => {
      stone.draw();

      if (
        stone.position.x < BOARD_OFFSET_X ||
        stone.position.x > BOARD_OFFSET_X + BOARD_WIDTH ||
        stone.position.y < BOARD_OFFSET_Y ||
        stone.position.y > BOARD_OFFSET_Y + BOARD_HEIGHT
      ) {
        stones = stones.filter((s) => s !== stone);
      }
    });

    for (let i = 0; i < stones.length; i += 1) {
      for (let j = i + 1; j < stones.length; j += 1) {
        handleCollision(stones[i], stones[j]);
      }
    }
  };

  s.mousePressed = () => {
    stones.forEach((stone) => {
      const distance = s.dist(
        s.mouseX,
        s.mouseY,
        stone.position.x,
        stone.position.y,
      );

      if (distance < stone.radius) {
        if (stone.type === turn) {
          stone.load();
        }
      }
    });
  };

  s.mouseReleased = () => {
    stones.forEach((stone) => {
      if (!stone.isLoading) {
        return;
      }

      if (turn === 'white') {
        turn = 'black';
      } else if (turn === 'black') {
        turn = 'white';
      }

      stone.shoot();
    });
  };

  const image = s.loadImage(
    'https://raw.githubusercontent.com/alexKwonIsAwesome/alkkagi/main/public/assets/board.svg',
  );
}, document.getElementById('app')!);
