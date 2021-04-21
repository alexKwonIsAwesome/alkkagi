import P5 from 'p5';

import { Game } from './game';

new P5((sketch: P5) => {
  const s = sketch;

  const game = new Game(s);

  game.addInitialStones();

  s.setup = () => {
    game.drawCanvas();
  };

  s.draw = () => {
    game.draw();

    game.handleStoneDeath();
    game.handleStoneCollision();

    game.stones.forEach((stone) => {
      stone.draw();
    });
  };

  s.mousePressed = () => {
    game.stones.forEach((stone) => {
      stone.handleMousePressed();
    });
  };

  s.mouseReleased = () => {
    game.stones.forEach((stone) => {
      stone.handleMouseReleased();
    });
  };
}, document.getElementById('app')!);
