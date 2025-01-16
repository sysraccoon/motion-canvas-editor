import {HighlightStyle} from '@codemirror/language';
import {tags} from '@lezer/highlight';
import {Gradient} from '@motion-canvas/2d';
import {Color, PossibleColor, SignalValue} from '@motion-canvas/core';

export const catpuccinColorScheme = generateColorSchemeFromBase16([
  '#1e1e2e', // 0x0 base
  '#181825', // 0x1 mantle
  '#313244', // 0x2 surface0
  '#45475a', // 0x3 surface1
  '#585b70', // 0x4 surface2
  '#cdd6f4', // 0x5 text
  '#f5e0dc', // 0x6 rosewater
  '#b4befe', // 0x7 lavender
  '#f38ba8', // 0x8 red
  '#fab387', // 0x9 peach
  '#f9e2af', // 0xA yellow
  '#a6e3a1', // 0xB green
  '#94e2d5', // 0xC teal
  '#89b4fa', // 0xD blue
  '#cba6f7', // 0xE mauve
  '#f2cdcd', // 0xF flamingo
]);

export const colors = catpuccinColorScheme;

export function generateColorSchemeFromBase16(scheme: PossibleColor[]) {
  if (scheme.length !== 16) {
    throw Error('base16 scheme must contain exactly 16 values');
  }
  const normalizedScheme = scheme.map(clr => new Color(clr));

  return {
    base16: normalizedScheme,
    codeStyle: generateCodeStyleFromBase16(normalizedScheme),

    background: normalizedScheme[0x0],
    backgroundAlt: normalizedScheme[0x1],
    foreground: normalizedScheme[0x5],
    foregroundAlt: normalizedScheme[0x4],
    surface: normalizedScheme[0x2],
    surfaceAlt: normalizedScheme[0x3],

    red: normalizedScheme[0x8],
    yellow: normalizedScheme[0xa],
    green: normalizedScheme[0xb],
    cyan: normalizedScheme[0xc],
    blue: normalizedScheme[0xd],
    magenta: normalizedScheme[0xe],
  };
}

function generateCodeStyleFromBase16(scheme: Color[]): HighlightStyle {
  return HighlightStyle.define([
    {
      tag: [tags.comment],
      color: scheme[0x3].hex(),
      fontStyle: 'italic',
    },
    {
      tag: [tags.invalid],
      color: scheme[0x4].hex(),
      borderBottom: `1px dotted ${scheme[0x8]}`,
    },
    {
      tag: [tags.paren, tags.brace, tags.bracket, tags.punctuation, tags.name],
      color: scheme[0x5].hex(),
    },
    {
      tag: [tags.operator, tags.operatorKeyword],
      color: scheme[0x7].hex(),
    },
    {
      tag: [tags.variableName, tags.special(tags.variableName)],
      color: scheme[0x8].hex(),
    },
    {
      // string interpolation braces
      tag: [tags.special(tags.brace)],
      color: scheme[0x8].hex(),
    },
    {
      tag: [
        tags.atom,
        tags.bool,
        tags.constant(tags.variableName),
        tags.number,
        tags.literal,
      ],
      color: scheme[0x9].hex(),
    },
    {
      tag: [tags.link],
      color: scheme[0x9].hex(),
      textDecoration: 'underline',
      textUnderlinePosition: 'under',
    },
    {
      tag: [tags.typeName, tags.className],
      color: scheme[0xa].hex(),
    },
    {
      tag: [tags.string],
      color: scheme[0xb].hex(),
    },
    {
      tag: [tags.regexp, tags.escape],
      color: scheme[0xc].hex(),
    },
    {
      tag: [tags.propertyName],
      color: scheme[0xd].hex(),
    },
    {
      tag: [tags.heading],
      color: scheme[0xd].hex(),
      fontWeight: 'bold',
    },
    {
      tag: [tags.keyword],
      color: scheme[0xe].hex(),
    },
    {
      tag: [tags.tagName],
      color: scheme[0xf].hex(),
    },
  ]);
}

export function linearGradient(
  from: SignalValue<PossibleColor>,
  to: SignalValue<PossibleColor>,
): Gradient {
  return new Gradient({
    fromX: 0,
    toX: 100,
    angle: 45,
    stops: [
      {offset: 0, color: from},
      {offset: 1, color: to},
    ],
  });
}
