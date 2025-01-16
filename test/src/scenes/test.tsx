import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {waitFor} from '@motion-canvas/core/lib/flow';

export default makeScene2D(function* () {
  yield* waitFor(5);
});
