import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { page, css, stripAtRule } from './dist.mjs';

test('dark only: no theme toggle and no stored-theme script', () => {
	const html = page('/');
	assert.doesNotMatch(html, /theme-toggle/);
	assert.doesNotMatch(html, /localStorage/);
	assert.match(css(), /color-scheme:\s*dark/);
});

test('Chakra Petch is self-hosted and IBM Plex Sans is gone', () => {
	assert.ok(existsSync(new URL('../dist/fonts/chakra-petch-latin-700-normal.woff2', import.meta.url)));
	assert.ok(existsSync(new URL('../dist/fonts/OFL.txt', import.meta.url)));
	assert.match(css(), /Chakra Petch/);
	assert.doesNotMatch(css(), /IBM Plex Sans/);
});

test('System tag brackets survive the CSS build (alt-text content syntax)', () => {
	assert.match(css(), /content:\s*"\[ "\s*\/\s*""/);
});

test('footer is the System line, not the drawing title block', () => {
	const html = page('/');
	assert.match(html, /Build \d{4}-\d{2}-\d{2}/);
	assert.doesNotMatch(html, /Drawn by/);
});

test('scroll-driven animation only exists behind @supports, so content is never stuck hidden', () => {
	const all = css();
	assert.match(all, /animation-timeline/);
	assert.doesNotMatch(stripAtRule(all, '@supports'), /animation-timeline/);
});
