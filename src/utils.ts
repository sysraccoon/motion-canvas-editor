import {Length, lines} from '@motion-canvas/2d';

export function allLines() {
  return lines(0, Infinity);
}

export function rasterizeLength(length: Length, nodeSize: number): number {
  let pixels = 0;

  if (typeof length == 'string') {
    const rawPrecentage = length.substring(0, length.length - 1);
    const precentage = parseFloat(rawPrecentage) / 100;
    pixels = precentage * nodeSize;
  } else if (typeof length == 'number') {
    pixels = length;
  } else {
    throw Error('Invalid length type');
  }

  return pixels;
}
