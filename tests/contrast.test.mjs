import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
// The first top-level :root block holds the tokens; the print block later overrides them.
const root = source.match(/:root\s*{([^}]*)}/)[1];
const tokens = Object.fromEntries([...root.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\b/g)].map((m) => [m[1], m[2]]));

function luminance(hex) {
	const [r, g, b] = [1, 3, 5]
		.map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
		.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

// [foreground, background]: every pair that carries text on the site.
const pairs = [
	['snow', 'abyss'], ['snow', 'armor'], ['snow', 'night'],
	['muted', 'abyss'], ['muted', 'armor'],
	['glow', 'abyss'], ['glow', 'armor'],
	['glow-core', 'armor'],
	['gate', 'abyss'], ['gate', 'armor'],
	['plume-text', 'abyss'], ['plume-text', 'armor'],
	['abyss', 'glow'], ['abyss', 'glow-core'],
];

for (const [fg, bg] of pairs) {
	test(`${fg} on ${bg} meets WCAG AA (4.5:1)`, () => {
		assert.ok(tokens[fg] && tokens[bg], `missing token --${fg} or --${bg}`);
		const ratio = contrast(tokens[fg], tokens[bg]);
		assert.ok(ratio >= 4.5, `${fg} on ${bg} is ${ratio.toFixed(2)}:1`);
	});
}

// [mark, background]: non-text marks (borders, brackets) need 3:1 (WCAG 1.4.11).
const marks = [['plume', 'abyss'], ['plume', 'armor']];

for (const [fg, bg] of marks) {
	test(`${fg} marks on ${bg} meet 3:1`, () => {
		assert.ok(tokens[fg] && tokens[bg], `missing token --${fg} or --${bg}`);
		const ratio = contrast(tokens[fg], tokens[bg]);
		assert.ok(ratio >= 3, `${fg} on ${bg} is ${ratio.toFixed(2)}:1`);
	});
}

test('white selection text on plume meets WCAG AA (4.5:1)', () => {
	const ratio = contrast('#ffffff', tokens.plume);
	assert.ok(ratio >= 4.5, `white on plume is ${ratio.toFixed(2)}:1`);
});
