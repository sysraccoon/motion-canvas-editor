import {
  CanvasStyleSignal,
  canvasStyleSignal,
  Code,
  CodeHighlighter,
  CodeProps,
  CodeRange,
  CodeSignal,
  initial,
  Layout,
  LayoutProps,
  PossibleCanvasStyle,
  Rect,
  resolveScope,
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
  highlighter: CodeHighlighter | null;
  selection: CodeRange[] | typeof DEFAULT;
  scroll: SignalValue<number>;
}

export class Editor extends Layout {
  @signal()
  declare public readonly title: SimpleSignal<Txt, this>;

  @signal()
  declare public readonly code: SimpleSignal<Code, this>;

  @signal()
  declare public readonly viewport: SimpleSignal<Scrollable, this>;

  @initial(colors.backgroundAlt)
  @canvasStyleSignal()
  declare public readonly fill: CanvasStyleSignal<this>;

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
    const linePosition = () => this.linePosition(line);
    this.viewport().scrollTo(linePosition);
  }

  public *tweenScrollToLine(line: number, duration: number) {
    const linePosition = () => this.linePosition(line);
    yield* this.viewport().tweenScrollTo(linePosition, duration);
  }

  public editSnapshot(snapshot: EditSnapshot) {
    this.title().text(snapshot.name);
    this.code().code(snapshot.code);
    this.code().selection(snapshot.selection);
    this.code().highlighter(snapshot.highlighter);
    this.scrollToLine(unwrap(snapshot.scroll));
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
      const newCode = resolveScope(
        snapshot.code(),
        scope => unwrap(scope.progress) > 0.5,
      );
      const oldCode = code.parsed();

      // default highlighter sometimes flickering without any actual changes in code
      if (newCode != oldCode) {
        tasks.push(code.code(snapshot.code, duration));
      } else {
        code.code(snapshot.code);
      }

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

  private linePosition(line: number): Vector2 {
    const lineHeight = this.code().lineHeight();
    const codeHeight = this.code().height();
    const actualLineHeight = rasterizeLength(lineHeight, codeHeight);
    return new Vector2(0, line * actualLineHeight);
  }
}
