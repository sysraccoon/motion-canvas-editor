import {Node, Rect, RectProps, signal} from '@motion-canvas/2d';
import {
  DEFAULT,
  PossibleVector2,
  SignalValue,
  SimpleSignal,
  ThreadGenerator,
  TimingFunction,
  unwrap,
  Vector2,
} from '@motion-canvas/core';
import {defaultTimingFunc} from '../consts';

export interface ScrollableProps extends RectProps {}

export class Scrollable extends Rect {
  @signal()
  declare protected readonly viewport: SimpleSignal<Node, this>;

  public constructor(props: ScrollableProps) {
    super({
      ...props,
      clip: true,
    });

    this.add(<Node ref={this.viewport}>{props.children}</Node>);
  }

  public *resetScroll() {
    this.viewport().position(DEFAULT);
  }

  public *tweenResetScroll(
    duration: number,
    timingFunc: TimingFunction = defaultTimingFunc,
  ) {
    yield* this.viewport().position(DEFAULT, duration, timingFunc);
  }

  public scroll(direction: SignalValue<PossibleVector2>) {
    const newPosition = this.viewport().position().add(unwrap(direction));
    this.viewport().position(newPosition);
  }

  public scrollTo(position: SignalValue<PossibleVector2>) {
    const newPosition = () => new Vector2(unwrap(position)).mul(-1);
    this.viewport().position(newPosition);
  }

  public *tweenScroll(
    direction: SignalValue<PossibleVector2>,
    duration: number,
    timingFunc: TimingFunction = defaultTimingFunc,
  ): ThreadGenerator {
    const newPosition = this.viewport()
      .position()
      .add(unwrap(direction))
      .mul(-1);
    yield* this.viewport().position(newPosition, duration, timingFunc);
  }

  public *tweenScrollTo(
    position: SignalValue<PossibleVector2>,
    duration: number,
    timingFunc: TimingFunction = defaultTimingFunc,
  ): ThreadGenerator {
    const newPosition = () => new Vector2(unwrap(position)).mul(-1);
    yield* this.viewport().position(newPosition, duration, timingFunc);
  }

  public *tweenScrollX(
    delta: SignalValue<number>,
    duration: number,
    timingFunc: TimingFunction = defaultTimingFunc,
  ): ThreadGenerator {
    const newPosition = this.position().addX(unwrap(delta)).mul(-1);
    yield* this.viewport().position(newPosition, duration, timingFunc);
  }

  public *tweenScrollY(
    delta: SignalValue<number>,
    duration: number,
    timingFunc: TimingFunction = defaultTimingFunc,
  ): ThreadGenerator {
    const newPosition = this.position().addY(unwrap(delta)).mul(-1);
    yield* this.viewport().position(newPosition, duration, timingFunc);
  }
}
