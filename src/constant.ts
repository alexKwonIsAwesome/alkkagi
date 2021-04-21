export const BOARD_OFFSET_X = 172;
export const BOARD_OFFSET_Y = 172;
export const BOARD_WIDTH = 456;
export const BOARD_HEIGHT = 456;

export const WHITE = 'white';
export const BLACK = 'black';

export const STONE_RADIUS = 12;

export const INITIAL_STONE_POSITION = [
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

export const INITIAL_STONES = [
  {
    type: WHITE,
    row: 4,
    column: 4,
  },
  {
    type: WHITE,
    row: 4,
    column: 7,
  },
  {
    type: WHITE,
    row: 4,
    column: 10,
  },
  {
    type: WHITE,
    row: 4,
    column: 13,
  },
  {
    type: WHITE,
    row: 4,
    column: 16,
  },
  {
    type: BLACK,
    row: 16,
    column: 4,
  },
  {
    type: BLACK,
    row: 16,
    column: 7,
  },
  {
    type: BLACK,
    row: 16,
    column: 10,
  },
  {
    type: BLACK,
    row: 16,
    column: 13,
  },
  {
    type: BLACK,
    row: 16,
    column: 16,
  },
];

export const BOARD_IMAGE_URL =
  'https://raw.githubusercontent.com/alexKwonIsAwesome/alkkagi/main/public/assets/board.svg';
