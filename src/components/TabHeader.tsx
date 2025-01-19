import {
  canvasStyleSignal,
  CanvasStyleSignal,
  initial,
  Layout,
  LayoutProps,
  Node,
  Path,
  PossibleCanvasStyle,
  Rect,
} from '@motion-canvas/2d';
import {SignalValue} from '@motion-canvas/core';
import {colors} from '../consts';

export interface TabHeaderProps extends LayoutProps {
  fill?: SignalValue<PossibleCanvasStyle>;
}

export class TabHeader extends Layout {
  @initial(colors.backgroundAlt)
  @canvasStyleSignal()
  declare public readonly fill: CanvasStyleSignal<this>;

  public constructor(props: TabHeaderProps) {
    super({
      offset: [-1, 1],
      ...props,
      layout: true,
      alignItems: 'end',
    });

    this.add(
      <Node>
        <Rect
          padding={[15, 30]}
          minHeight={40}
          fill={this.fill}
          radius={[20, 20, 0, 0]}
        >
          {props.children}
        </Rect>
        <Path
          marginRight={15}
          data={'M0,25L0,0S0,25,25,25Z'}
          fill={this.fill}
        />
      </Node>,
    );
  }
}
