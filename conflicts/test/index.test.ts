import { Ordering, toVersion, VersionVector } from '../src';

it('from string', () => {
	const expected = {
		entries: [
			{ id: 'A', value: 10 },
			{ id: 'B', value: 20 },
			{ id: 'C', value: 30 }
		]
	};
	const input = 'A.10,B.20,C.30';
	const v = toVersion(input);
	expect(v).toEqual(expected);
});

it('to string', () => {
	const input = [
		{ id: 'A', value: 10 },
		{ id: 'B', value: 20 },
		{ id: 'C', value: 30 }
	];
	const expected = 'A.10,B.20,C.30';
	const v = new VersionVector(input);
	expect(v.toString()).toEqual(expected);
});

it('get', () => {
	const v = toVersion('A.10,B.20,C.30');
	expect(v.get('A')).toEqual(10);
	expect(v.get('D')).toBeUndefined();
	expect(v.get('B')).toEqual(20);
	expect(v.get('C')).toEqual(30);
	expect(v.get('E')).toBeUndefined();
});

it('bump', () => {
	const v = toVersion('origin.0');
	expect(v.bump('origin').toString()).toEqual('origin.1');
});

it('cmp', () => {
	const testCases: Array<{ ord: Ordering, v1: string, v2: string }> = [
		{ ord: Ordering.Equal, v1: '', v2: '' },
		{ ord: Ordering.Equal, v1: '', v2: '10.0' },
		{ ord: Ordering.Equal, v1: '10.0', v2: '' },
		{ ord: Ordering.Equal, v1: '10.0', v2: '20.0' },
		{ ord: Ordering.Equal, v1: '10.1,20.2', v2: '10.1,20.2' },
		{ ord: Ordering.Greater, v1: '1.10', v2: '' },
		{ ord: Ordering.Greater, v1: '1.10', v2: '1.0' },
		{ ord: Ordering.Greater, v1: '1.10', v2: '1.8' },
		{ ord: Ordering.Greater, v1: '1.20,20.50', v2: '1.10,20.20' },
		{ ord: Ordering.Greater, v1: '1.10,20.50', v2: '1.10,20.20' },
		{ ord: Ordering.Less, v1: '', v2: '1.10' },
		{ ord: Ordering.Less, v1: '1.0', v2: '1.10' },
		{ ord: Ordering.Less, v1: '1.8', v2: '1.10' },
		{ ord: Ordering.Less, v1: '1.8,2.20', v2: '1.10,2.20' },
		{ ord: Ordering.Less, v1: '1.8,2.20', v2: '1.8,2.50' },
		{ ord: Ordering.Concurrent, v1: '1.10', v2: '2.22' },
		{ ord: Ordering.Concurrent, v1: '1.10,2.20', v2: '1.8,2.22' },
	];

	for (const tc of testCases) {
		const v1 = toVersion(tc.v1);
		const v2 = toVersion(tc.v2);
		const res = v1.cmp(v2);
		expect(res).toEqual(tc.ord);
	}
});

it('merge', () => {
	const testCases: Array<{ v1: string, v2: string, res: string }> = [
		{ v1: '', v2: '', res: '' },
		{ v1: '1.10,2.20', v2: '1.10,2.20', res: '1.10,2.20' },
		{ v1: '', v2: '1.10', res: '1.10' },
		{ v1: '1.10', v2: '1.10,2.20', res: '1.10,2.20' },
		{ v1: '1.10', v2: '2.20', res: '1.10,2.20' },
		{ v1: '1.10,4.40', v2: '1.10,2.20,4.40', res: '1.10,2.20,4.40' },
		{ v1: '1.10,2.40', v2: '1.20,2.20', res: '1.20,2.40' },
		// VersionVector ids are strings not numbers, hence the ordering of '5.1' at the end of the vector
		{ v1: '10.1,20.2,30.1', v2: '5.1,10.2,15.1,20.1,25.1,35.1',
			res: '10.2,15.1,20.2,25.1,30.1,35.1,5.1' }
	];

	for (const tc of testCases) {
		const v1 = toVersion(tc.v1);
		const v2 = toVersion(tc.v2);
		const merged = v1.merge(v2);
		expect(merged.toString()).toEqual(tc.res);
	}
});
