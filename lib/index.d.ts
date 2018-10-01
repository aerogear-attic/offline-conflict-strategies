export declare enum Ordering {
    Less = 1,
    Equal = 2,
    Greater = 3,
    Concurrent = 4
}
interface Entry {
    id: string;
    value: number;
}
export declare function cmp(a: number | string, b: number | string): Ordering;
export declare class VersionVector {
    readonly entries: Entry[];
    constructor(obj?: Readonly<Entry[]> | string);
    toString(): string;
    add(id: string): Readonly<VersionVector>;
    remove(id: string): Readonly<VersionVector>;
    get(id: string): number | undefined;
    set(id: string, value: number): Readonly<VersionVector>;
    has(id: string): boolean;
    bump(id: string): Readonly<VersionVector>;
    empty(): boolean;
    equal(other: Readonly<VersionVector>): boolean;
    gt(other: Readonly<VersionVector>): boolean;
    lt(other: Readonly<VersionVector>): boolean;
    concurrent(other: Readonly<VersionVector>): boolean;
    merge(other: Readonly<VersionVector>): Readonly<VersionVector>;
    cmp(other: Readonly<VersionVector>): Ordering;
}
export declare function toVersion(str?: string | null): VersionVector;
export {};
