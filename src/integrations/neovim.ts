import {Code, CodeHighlighter, pointToPoint} from '@motion-canvas/2d';
import {DEFAULT} from '@motion-canvas/core';
import {EditSnapshot} from '../components/Editor';

export interface NeoVimBufferSnapshotV1 {
  name: string;
  content: string;
  scroll: number;
  selection: null | {
    start_row: number;
    start_col: number;
    end_row: number;
    end_col: number;
  };
}

export interface NeoVimSession {
  version: number;
}

export interface NeoVimSessionV1 extends NeoVimSession {
  snapshots: NeoVimBufferSnapshotV1[];
}

export type HighlighterFactory = (
  name: string,
  content: string,
) => CodeHighlighter | null;

export function parseNeoVimSession(
  session: NeoVimSession,
  highlighterFactory: HighlighterFactory,
) {
  if (session.version == 1) {
    return parseNeoVimSessionV1(session as NeoVimSessionV1, highlighterFactory);
  }

  throw SyntaxError('parseNeoVimSession: unknown version');
}

export function parseNeoVimSessionV1(
  session: NeoVimSessionV1,
  highlighterFactory: HighlighterFactory,
): EditSnapshot[] {
  const snapshots = session.snapshots;
  return snapshots.map(snapshot => {
    const selection = snapshot.selection;
    return {
      name: snapshot.name,
      code: Code.createSignal(snapshot.content),
      scroll: snapshot.scroll,
      highlighter: highlighterFactory(snapshot.name, snapshot.content),
      selection: selection
        ? [
            pointToPoint(
              selection.start_row,
              selection.start_col,
              selection.end_row,
              // for some reason endColumn exclusive, while endRow inclusive
              // fix this by adding 1
              selection.end_col + 1,
            ),
          ]
        : DEFAULT,
    };
  });
}
