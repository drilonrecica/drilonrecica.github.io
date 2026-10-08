import { test } from 'node:test';
import assert from 'node:assert/strict';
import { levelSince, questStatus } from '../src/lib/system.ts';

test('level counts whole years since the start year', () => {
	assert.equal(levelSince(2012, new Date(2026, 9, 8)), 14);
	assert.equal(levelSince(2012, new Date(2026, 11, 31)), 14);
	assert.equal(levelSince(2012, new Date(2027, 0, 1)), 15);
});

test('ongoing periods are active, finished ones cleared', () => {
	assert.equal(questStatus('Nov 2023 – Present'), 'active');
	assert.equal(questStatus('2020 – now'), 'active');
	assert.equal(questStatus('2023 – 2024'), 'cleared');
	assert.equal(questStatus('2015 – 2020'), 'cleared');
	assert.equal(questStatus('Nov 2019 – Nov 2020'), 'cleared');
});
