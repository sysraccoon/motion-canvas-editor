import {
  CanvasStyleSignal,
  canvasStyleSignal,
  Code,
  CodeProps,
  CodeRange,
  CodeSignal,
  initial,
  Layout,
  LayoutProps,
  LezerHighlighter,
  PossibleCanvasStyle,
  Rect,
  signal,
  Txt,
} from '@motion-canvas/2d';
import {
  all,
  chain,
  DEFAULT,
  SignalValue,
  SimpleSignal,
  ThreadGenerator,
  unwrap,
  Vector2,
} from '@motion-canvas/core';
import {colors} from '../consts';
import {allLines, rasterizeLength} from '../utils';
import {Scrollable, ScrollableProps} from './Scrollable';
import {TabHeader} from './TabHeader';

export interface EditorProps extends LayoutProps {
  viewportProps?: ScrollableProps;
  codeProps?: CodeProps;

  editSnapshot?: EditSnapshot;

  fill?: SignalValue<PossibleCanvasStyle>;
}

export interface EditSnapshot {
  name: SignalValue<string>;
  code: CodeSignal<void>;
  highlighter: LezerHighlighter;
  selection: CodeRange[] | typeof DEFAULT;
  scroll: SignalValue<number>;
}

export class Editor extends Layout {
  @signal()
  public declare readonly title: SimpleSignal<Txt, this>;

  @signal()
  public declare readonly code: SimpleSignal<Code, this>;

  @signal()
  public declare readonly viewport: SimpleSignal<Scrollable, this>;

  @initial(colors.backgroundAlt)
  @canvasStyleSignal()
  public declare readonly fill: CanvasStyleSignal<this>;

  public constructor(props: EditorProps) {
    super({
      ...props,
      layout: true,
      direction: 'column',
    });

    this.add(
      <TabHeader fill={this.fill} marginBottom={-1}>
        <Txt ref={this.title} fill={colors.foreground} />
      </TabHeader>,
    );
    this.add(
      <Rect
        padding={30}
        clip={true}
        radius={[0, 15, 15, 15]}
        fill={this.fill}
        layout
      >
        <Scrollable {...props.viewportProps} ref={this.viewport}>
          <Code fill={colors.foreground} {...props.codeProps} ref={this.code} />
        </Scrollable>
      </Rect>,
    );

    if (props.editSnapshot) {
      this.editSnapshot(props.editSnapshot);
    }
  }

  public scrollToLine(line: number) {
    const scrollLinePosition = this.scrollLinePosition(line);
    this.viewport().scrollTo(scrollLinePosition);
  }

  public *tweenScrollToLine(line: number, duration: number) {
    const scrollLinePosition = this.scrollLinePosition(line);
    yield* this.viewport().tweenScrollTo(scrollLinePosition, duration);
  }

  public editSnapshot(snapshot: EditSnapshot) {
    this.title().text(snapshot.name);
    this.scrollToLine(unwrap(snapshot.scroll));
    this.code().selection(snapshot.selection);
    this.code().code(snapshot.code);
    this.code().highlighter(snapshot.highlighter);
  }

  public *tweenEditSnapshot(snapshot: EditSnapshot, duration: number) {
    const that = this;
    const code = this.code();

    const tasks: ThreadGenerator[] = [
      this.title().text(snapshot.name, duration),
      this.code().selection(snapshot.selection, duration),
    ];

    if (
      this.title().text() == snapshot.name &&
      code.highlighter() == snapshot.highlighter
    ) {
      tasks.push(code.code(snapshot.code, duration));
      tasks.push(this.tweenScrollToLine(unwrap(snapshot.scroll), duration));
    } else {
      tasks.push(
        chain(
          code.opacity(0, duration * 0.5),
          (function* () {
            code.highlighter(snapshot.highlighter);
            that.scrollToLine(unwrap(snapshot.scroll));
          })(),
          code.opacity(1, duration * 0.5),
        ),
      );
      tasks.push(code.code.replace(allLines(), snapshot.code, duration));
    }

    yield* all(...tasks);
  }

  private scrollLinePosition(line: number): Vector2 {
    const lineHeight = this.code().lineHeight();
    const actualLineHeight = rasterizeLength(lineHeight, this.code().height());
    const scrollOffset = line * actualLineHeight;
    return new Vector2(0, scrollOffset);
  }
}
