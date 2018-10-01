"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function stringComparator(a, b) {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}
// merge() and cmp() ported from https://github.com/vhbit/version-vec/blob/master/src/lib.rs
var Ordering;
(function (Ordering) {
    Ordering[Ordering["Less"] = 1] = "Less";
    Ordering[Ordering["Equal"] = 2] = "Equal";
    Ordering[Ordering["Greater"] = 3] = "Greater";
    Ordering[Ordering["Concurrent"] = 4] = "Concurrent";
})(Ordering = exports.Ordering || (exports.Ordering = {}));
function cmp(a, b) {
    if (a > b) {
        return Ordering.Greater;
    }
    else if (a < b) {
        return Ordering.Less;
    }
    else {
        return Ordering.Equal;
    }
}
exports.cmp = cmp;
function combine(a, b) {
    if (b === Ordering.Less && a === Ordering.Equal) {
        return Ordering.Less;
    }
    else if (b === Ordering.Greater && a === Ordering.Equal) {
        return Ordering.Greater;
    }
    else if ((b === Ordering.Greater && a === Ordering.Less)
        || (b === Ordering.Less && a === Ordering.Greater)) {
        return Ordering.Concurrent;
    }
    else {
        return a;
    }
}
function copy(entry) {
    const { id, value } = entry;
    return { id, value };
}
function entryComparator(a, b) {
    return stringComparator(a.id, b.id);
}
function assertValidID(id) {
    if (id.includes(':') || id.includes(',')) {
        throw new Error(`Invalid character for vector version ID. ':' and ',' are not permitted.`);
    }
}
class VersionVector {
    constructor(obj) {
        let entries;
        if (obj == null || obj === '') {
            entries = [];
        }
        else if (typeof obj === 'string') {
            entries = obj.split(',').map(s => {
                const [id, valueStr] = s.split('.');
                const value = +valueStr;
                return { id, value };
            }).sort(entryComparator);
        }
        else {
            entries = obj;
        }
        this.entries = entries.slice().sort(entryComparator);
    }
    toString() {
        // Format: "A.0,B.3,C.1"
        return this.entries.map(e => [e.id, e.value].join('.')).join(',');
    }
    add(id) {
        assertValidID(id);
        return this.set(id, 0);
    }
    remove(id) {
        return new VersionVector(this.entries.filter(e => e.id !== id));
    }
    get(id) {
        const entry = this.entries.find(e => e.id === id);
        if (entry == null) {
            return undefined;
        }
        return entry.value;
    }
    set(id, value) {
        assertValidID(id);
        const entries = this.entries.filter(e => e.id !== id);
        return new VersionVector([
            ...entries,
            { id, value }
        ]);
    }
    has(id) {
        return this.get(id) != null;
    }
    bump(id) {
        assertValidID(id);
        const value = this.get(id);
        return this.set(id, (value || 0) + 1);
    }
    empty() {
        return this.entries.length === 0;
    }
    equal(other) {
        return this.cmp(other) === Ordering.Equal;
    }
    gt(other) {
        return this.cmp(other) === Ordering.Greater;
    }
    lt(other) {
        return this.cmp(other) === Ordering.Less;
    }
    concurrent(other) {
        return this.cmp(other) === Ordering.Concurrent;
    }
    merge(other) {
        let selfIdx = 0;
        let otherIdx = 0;
        const resEntries = JSON.parse(JSON.stringify(this.entries));
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
            }
            else {
                if (left.id < right.id) {
                    selfIdx += 1;
                }
                else {
                    resEntries.splice(selfIdx, 0, copy(right));
                    selfIdx += 1;
                    otherIdx += 1;
                }
            }
        }
        return new VersionVector(resEntries);
    }
    cmp(other) {
        let selfIdx = 0;
        let otherIdx = 0;
        let result = Ordering.Equal;
        while (true) {
            if (selfIdx >= this.entries.length) {
                if (otherIdx === other.entries.length) {
                    // both exhausted
                    return result;
                }
                else {
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
            let deltas;
            if (idCmp === Ordering.Less) {
                deltas = {
                    selfIdx: 1,
                    otherIdx: 0,
                    order: left.value !== 0 ? Ordering.Greater : Ordering.Equal
                };
            }
            else if (idCmp === Ordering.Greater) {
                deltas = {
                    selfIdx: 0,
                    otherIdx: 1,
                    order: right.value !== 0 ? Ordering.Less : Ordering.Equal
                };
            }
            else { // idCmp === Ordering.Equal
                deltas = {
                    selfIdx: 1,
                    otherIdx: 1,
                    order: cmp(left.value, right.value)
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
exports.VersionVector = VersionVector;
function toVersion(str) {
    return new VersionVector(str || '');
}
exports.toVersion = toVersion;
