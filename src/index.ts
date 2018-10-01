function stringComparator(a: string, b: string): number {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

// merge() and cmp() ported from https://github.com/vhbit/version-vec/blob/master/src/lib.rs

export enum Ordering {
  Less = 1,
  Equal = 2,
  Greater = 3,
  Concurrent = 4,
}

interface Entry {
  id: string;
  value: number;
}

export function cmp(a: number | string, b: number | string): Ordering {
  if (a > b) {
    return Ordering.Greater;
  } else if (a < b) {
    return Ordering.Less;
  } else {
    return Ordering.Equal;
  }
}

function combine(a: Ordering, b: Ordering): Ordering {
  if (b === Ordering.Less && a === Ordering.Equal) {
    return Ordering.Less;
  } else if (b === Ordering.Greater && a === Ordering.Equal) {
    return Ordering.Greater;
  } else if (
    (b === Ordering.Greater && a === Ordering.Less) ||
    (b === Ordering.Less && a === Ordering.Greater)
  ) {
    return Ordering.Concurrent;
  } else {
    return a;
  }
}

function copy(entry: Entry): Entry {
  const { id, value } = entry;
  return { id, value };
}

function entryComparator(a: Entry, b: Entry): number {
  return stringComparator(a.id, b.id);
}

function assertValidID(id: string) {
  if (id.includes(':') || id.includes(',')) {
    throw new Error(
      `Invalid character for vector version ID. ':' and ',' are not permitted.`,
    );
  }
}

export class VersionVector {
  public readonly entries: Entry[];

  constructor(obj?: Readonly<Entry[]> | string) {
    let entries: Readonly<Entry[]>;
    if (obj == null || obj === '') {
      entries = [];
    } else if (typeof obj === 'string') {
      entries = obj
        .split(',')
        .map(s => {
          const [id, valueStr] = s.split('.');
          const value = +valueStr;
          return { id, value };
        })
        .sort(entryComparator);
    } else {
      entries = obj;
    }
    this.entries = entries.slice().sort(entryComparator);
  }

  public toString() {
    // Format: "A.0,B.3,C.1"
    return this.entries.map(e => [e.id, e.value].join('.')).join(',');
  }

  public add(id: string): Readonly<VersionVector> {
    assertValidID(id);
    return this.set(id, 0);
  }

  public remove(id: string): Readonly<VersionVector> {
    return new VersionVector(this.entries.filter(e => e.id !== id));
  }

  public get(id: string): number | undefined {
    const entry = this.entries.find(e => e.id === id);
    if (entry == null) {
      return undefined;
    }
    return entry.value;
  }

  public set(id: string, value: number): Readonly<VersionVector> {
    assertValidID(id);
    const entries = this.entries.filter(e => e.id !== id);
    return new VersionVector([...entries, { id, value }]);
  }

  public has(id: string): boolean {
    return this.get(id) != null;
  }

  public bump(id: string): Readonly<VersionVector> {
    assertValidID(id);
    const value = this.get(id);
    return this.set(id, (value || 0) + 1);
  }

  public empty(): boolean {
    return this.entries.length === 0;
  }

  public equal(other: Readonly<VersionVector>): boolean {
    return this.cmp(other) === Ordering.Equal;
  }

  public gt(other: Readonly<VersionVector>): boolean {
    return this.cmp(other) === Ordering.Greater;
  }

  public lt(other: Readonly<VersionVector>): boolean {
    return this.cmp(other) === Ordering.Less;
  }

  public concurrent(other: Readonly<VersionVector>): boolean {
    return this.cmp(other) === Ordering.Concurrent;
  }

  public merge(other: Readonly<VersionVector>): Readonly<VersionVector> {
    let selfIdx = 0;
    let otherIdx = 0;
    const resEntries: Entry[] = JSON.parse(JSON.stringify(this.entries));

    while (true) {
      if (selfIdx >= resEntries.length) {
        for (const i of other.entries.slice(otherIdx)) {
          resEntries.push(copy(i));
        }
        break;
      }

      if (otherIdx >= other.entries.length) {
        break;
      }

      const left = resEntries[selfIdx];
      const right = other.entries[otherIdx];

      if (left.id === right.id) {
        resEntries[selfIdx].value = Math.max(left.value, right.value);
        selfIdx += 1;
        otherIdx += 1;
      } else {
        if (left.id < right.id) {
          selfIdx += 1;
        } else {
          resEntries.splice(selfIdx, 0, copy(right));
          selfIdx += 1;
          otherIdx += 1;
        }
      }
    }

    return new VersionVector(resEntries);
  }

  public cmp(other: Readonly<VersionVector>): Ordering {
    let selfIdx = 0;
    let otherIdx = 0;
    let result = Ordering.Equal;

    while (true) {
      if (selfIdx >= this.entries.length) {
        if (otherIdx === other.entries.length) {
          // both exhausted
          return result;
        } else {
          // other is not exhausted, so self is less if there is at least 1 non-zero
          if (other.entries.slice(otherIdx).find(e => e.value > 0) != null) {
            result = combine(result, Ordering.Less);
          }
          return result;
        }
      }

      if (otherIdx >= other.entries.length) {
        // since we've got here self is not exhausted yet
        // => self is greater if there is at least 1 non-zero
        if (this.entries.slice(selfIdx).find(e => e.value > 0) != null) {
          result = combine(result, Ordering.Greater);
        }
        return result;
      }

      const left = this.entries[selfIdx];
      const right = other.entries[otherIdx];

      const idCmp = cmp(left.id, right.id);
      let deltas: { selfIdx: number; otherIdx: number; order: Ordering };

      if (idCmp === Ordering.Less) {
        deltas = {
          selfIdx: 1,
          otherIdx: 0,
          order: left.value !== 0 ? Ordering.Greater : Ordering.Equal,
        };
      } else if (idCmp === Ordering.Greater) {
        deltas = {
          selfIdx: 0,
          otherIdx: 1,
          order: right.value !== 0 ? Ordering.Less : Ordering.Equal,
        };
      } else {
        // idCmp === Ordering.Equal
        deltas = {
          selfIdx: 1,
          otherIdx: 1,
          order: cmp(left.value, right.value),
        };
      }

      selfIdx += deltas.selfIdx;
      otherIdx += deltas.otherIdx;
      if (deltas.order !== Ordering.Equal) {
        result = combine(result, deltas.order);
      }

      // Ouch, there is a conflict, nothing to catch here
      if (result === Ordering.Concurrent) {
        return result;
      }
    }
  }
}

export function toVersion(str?: string | null): VersionVector {
  return new VersionVector(str || '');
}
