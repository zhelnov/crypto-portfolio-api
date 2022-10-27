export interface Point {
  x: number;
  y: number;
}

export class Extrapolator {
  private readonly dataMap: Map<number, number>;

  private readonly cache: Map<number, number> = new Map<number, number>();

  constructor(private readonly data: Point[]) {
    this.dataMap = new Map(data.map(({ x, y }) => [x, y]));
  }

  getPolygonal(xSample: number): number {
    if (this.dataMap.size < 2) {
      throw 'At least two samples are required';
    }

    const existent = this.dataMap.get(xSample);
    if (typeof existent !== 'undefined') {
      return existent;
    }

    let output = 0;
    for (let i = 0; i < this.data.length; i++) {
      const { x, y } = this.data[i];
      let innerproduct = 1;

      for (let j = 0; j < this.data.length; j++) {
        if (i === j) {
          continue;
        }
        const { x: xj } = this.data[j];
        innerproduct *= (xSample - xj) / (x - xj);
      }
      output += innerproduct * y;
    }

    return output;
  }

  getLinear(xSample: number): number {
    const existent = this.dataMap.get(xSample);
    if (typeof existent !== 'undefined') {
      return existent;
    }

    let closeMin = -Infinity,
      closeMax = Infinity,
      max = -Infinity,
      preMax = -Infinity,
      min = Infinity,
      preMin = Infinity;

    for (const x of this.dataMap.keys()) {
      if (x < xSample && x > closeMin) {
        closeMin = x;
      }
      if (x > xSample && x < closeMax) {
        closeMax = x;
      }
      if (x > max) {
        preMax = max;
        max = x;
      }
      if (x < min) {
        preMin = min;
        min = x;
      }
      if (x < preMin && x > min) {
        preMin = x;
      }
    }

    //this is redefined if we want to extrapolate near the ends of the evidence set
    let baseValueIndex = closeMin;

    if (closeMax === Infinity) {
      closeMax = max;
      closeMin = preMax;
      baseValueIndex = max;
    }
    if (closeMin === -Infinity) {
      closeMax = preMin;
      closeMin = min;
      baseValueIndex = min;
    }

    const delta = closeMax - closeMin;
    const valDelta = this.dataMap.get(closeMax) - this.dataMap.get(closeMin);
    const deltaLength = xSample - baseValueIndex;

    return this.dataMap.get(baseValueIndex) + deltaLength * (valDelta / delta);
  }
}
