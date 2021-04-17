import { Vector } from 'p5';
import { BOARD_OFFSET_X, BOARD_OFFSET_Y } from './app';
import Stone from './stone';

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getPositionByMatrix = (row: number, column: number) => {
  const y = BOARD_OFFSET_Y - 12 + row * 24;
  const x = BOARD_OFFSET_X - 12 + column * 24;

  return {
    x,
    y,
  };
};

export const handleCollision = (baseStone: Stone, targetStone: Stone) => {
  // Get distances between the stones
  const distanceVect = Vector.sub(targetStone.position, baseStone.position);

  // Calculate magnitude of the vector separating the stones
  const distanceVectMag = distanceVect.mag();

  // Minimum distance before they are touching
  const minDistance = baseStone.radius + targetStone.radius;

  if (distanceVectMag < minDistance) {
    const distanceCorrection = (minDistance - distanceVectMag) / 2.0;
    const d = distanceVect.copy();
    const correctionVector = d.normalize().mult(distanceCorrection);
    targetStone.position.add(correctionVector);
    baseStone.position.sub(correctionVector);

    // get angle of distanceVect
    const theta = distanceVect.heading();
    // precalculate trig values
    // const sine = baseStone.s.sin(theta);
    // const cosine = baseStone.s.cos(theta);
    const sine = Math.sin(theta);
    const cosine = Math.cos(theta);

    /* bTemp will hold rotated stone baseStone.positions. You 
       just need to worry about bTemp[1] baseStone.position*/
    const bTemp = [new Vector(), new Vector()];

    /* this stone's baseStone.position is relative to the targetStone
       so you can use the vector between them (bVect) as the 
       reference point in the rotation expressions.
       bTemp[0].baseStone.position.x and bTemp[0].baseStone.position.y will initialize
       automatically to 0.0, which is what you want
       since b[1] will rotate around b[0] */
    bTemp[1].x = cosine * distanceVect.x + sine * distanceVect.y;
    bTemp[1].y = cosine * distanceVect.y - sine * distanceVect.x;

    // rotate Temporary velocities
    const vTemp = [new Vector(), new Vector()];

    vTemp[0].x = cosine * baseStone.velocity.x + sine * baseStone.velocity.y;
    vTemp[0].y = cosine * baseStone.velocity.y - sine * baseStone.velocity.x;
    vTemp[1].x =
      cosine * targetStone.velocity.x + sine * targetStone.velocity.y;
    vTemp[1].y =
      cosine * targetStone.velocity.y - sine * targetStone.velocity.x;

    /* Now that velocities are rotated, you can use 1D
       conservation of momentum equations to calculate 
       the final baseStone.velocity along the x-axis. */
    const vFinal = [new Vector(), new Vector()];

    // final rotated baseStone.velocity for b[0]
    vFinal[0].x =
      ((baseStone.mass - targetStone.mass) * vTemp[0].x +
        2 * targetStone.mass * vTemp[1].x) /
      (baseStone.mass + targetStone.mass);
    vFinal[0].y = vTemp[0].y;

    // final rotated baseStone.velocity for b[0]
    vFinal[1].x =
      ((targetStone.mass - baseStone.mass) * vTemp[1].x +
        2 * baseStone.mass * vTemp[0].x) /
      (baseStone.mass + targetStone.mass);
    vFinal[1].y = vTemp[1].y;

    // hack to avoid clumping
    bTemp[0].x += vFinal[0].x;
    bTemp[1].x += vFinal[1].x;

    /* Rotate stone baseStone.positions and velocities back
       Reverse signs in trig expressions to rotate 
       in the opposite direction */
    // rotate stones
    const bFinal = [new Vector(), new Vector()];

    bFinal[0].x = cosine * bTemp[0].x - sine * bTemp[0].y;
    bFinal[0].y = cosine * bTemp[0].y + sine * bTemp[0].x;
    bFinal[1].x = cosine * bTemp[1].x - sine * bTemp[1].y;
    bFinal[1].y = cosine * bTemp[1].y + sine * bTemp[1].x;

    // update stones to screen baseStone.position
    targetStone.position.x = baseStone.position.x + bFinal[1].x;
    targetStone.position.y = baseStone.position.y + bFinal[1].y;

    baseStone.position.add(bFinal[0]);

    // update velocities
    baseStone.velocity.x = cosine * vFinal[0].x - sine * vFinal[0].y;
    baseStone.velocity.y = cosine * vFinal[0].y + sine * vFinal[0].x;
    targetStone.velocity.x = cosine * vFinal[1].x - sine * vFinal[1].y;
    targetStone.velocity.y = cosine * vFinal[1].y + sine * vFinal[1].x;
  }
};
