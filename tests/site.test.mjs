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

test('home sections are System windows with dual labels', () => {
	const html = page('/');
	const tags = [...html.matchAll(/class="window-bar tag"[^>]*>([^<]+)</g)].map((m) => m[1].trim());
	for (const tag of ['Quest log', 'Shadow army', 'Hunter record', 'Passive skills', 'Player']) {
		assert.ok(tags.includes(tag), `missing [ ${tag} ] window, found: ${tags.join(', ')}`);
	}
	assert.match(html, /class="window-bar tag border-l-\[3px\] border-l-plume"[^>]*><span class="text-plume-text" aria-hidden="true">! <\/span>System message</);
	for (const heading of ['Selected work', 'Open source', 'Experience', 'How I work', 'About', 'Contact']) {
		assert.match(html, new RegExp(`<h2[^>]*>${heading}</h2>`));
	}
});

test('hero is a STATUS window with a factual level and no rank', () => {
	const html = page('/');
	const level = new Date().getFullYear() - 2012;
	assert.match(html, /class="window-bar tag"[^>]*>Status</);
	assert.match(html, new RegExp(`>${level}</span>`));
	assert.match(html, /years building for Android, since 2012/);
	assert.match(html, />AppDev GmbH</);
	assert.doesNotMatch(html, />Rank</);
	assert.match(html, /class="window-bar tag"[^>]*>Stats</);
	assert.doesNotMatch(html, /ltm-title/);
});

test('quest cards carry a status mark derived from their period', () => {
	const html = page('/');
	const marks = [...html.matchAll(/class="mark mark-(active|cleared)"/g)].map((m) => m[1]);
	assert.equal(marks.length, 3, 'one mark per published case study');
	// Deutsche Bahn ("Nov 2023 – Present") is the only running quest today.
	assert.equal(marks.filter((m) => m === 'active').length, 1);
});

test('igris carries the Arise flourish, hidden from screen readers', () => {
	const html = page('/');
	const arise = [...html.matchAll(/<span[^>]*class="arise[^"]*"[^>]*>/g)];
	assert.equal(arise.length, 1);
	assert.match(arise[0][0], /aria-hidden="true"/);
});

test('contact is a System message with an Accept mailto', () => {
	const html = page('/');
	assert.match(html, /A new quest has arrived\./);
	assert.match(html, /<a href="mailto:drilonrecica\.dev@gmail\.com" class="btn btn-primary[^"]*">Accept/);
});

for (const slug of ['deutsche-bahn', 'qisara', 'security-library']) {
	test(`/work/${slug} is a quest report`, () => {
		const html = page(`/work/${slug}`);
		assert.match(html, /class="window-bar tag"[^>]*>Quest info</);
		assert.match(html, /class="mark mark-(active|cleared)[^"]*"/);
		assert.match(html, /(Previous|Next) quest/);
	});
}

test('figures sit in System windows', () => {
	assert.match(page('/work/qisara'), /<figure class="window[^"]*"/);
});

test('/cv stays sober: no System labels on the CV itself', () => {
	const html = page('/cv');
	assert.ok(html.includes('<main') && html.includes('</main>'));
	const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
	assert.doesNotMatch(main, /class="(window-bar )?tag"/);
	assert.doesNotMatch(main, /mark-(active|cleared)/);
});

test('print turns the dark palette into black on white', () => {
	const print = css().match(/@media print\s*{\s*(?:@page\s*{[^}]*}\s*)?:root\s*{([^}]*)}/);
	assert.ok(print, 'print block with :root overrides');
	assert.match(print[1], /--abyss:\s*#fff/);
	assert.match(print[1], /--snow:\s*#000/);
	assert.match(css(), /@media print[\s\S]*\.cv h1[\s\S]*?font-family:\s*var\(--font-sans\)/);
});

test('404 is a closed gate', () => {
	const html = page('/404');
	assert.match(html, /class="window window-alert[^"]*"/);
	assert.match(html, /class="window-bar tag border-l-\[3px\] border-l-plume"[^>]*><span class="text-plume-text" aria-hidden="true">! <\/span>Gate closed</);
	assert.match(html, /This dungeon doesn(&#39;|')t exist\./);
});

test('plume red is a signature and an alert, used sparingly', () => {
	const html = page('/');
	assert.match(html, /<span class="text-plume-text"[^>]*aria-hidden="true"[^>]*>\/ <\/span>Drilon Reçica</);
	assert.doesNotMatch(html, />ç<\/span>/);
	// Nav slash, contact "!" and contact border are the only red marks in the markup;
	// corners, hover underlines and selection come from CSS.
	assert.equal((html.match(/\b(text|border-l)-plume(-text)?\b/g) ?? []).length, 3);
});

test('the nav marks the current page with aria-current, without JS', () => {
	assert.match(page('/cv'), /<a href="\/cv"[^>]*aria-current="page"/);
	assert.match(page('/work/qisara'), /<a href="\/#work"[^>]*aria-current="page"/);
	assert.doesNotMatch(page('/'), /aria-current/);
});

test('every window carries a red plume corner, and selection is red', () => {
	const all = css();
	assert.match(all, /\.window:{1,2}after\s*{[^}]*border-color:\s*var\(--plume\)/);
	assert.match(all, /::selection\s*{[^}]*background(-color)?:\s*var\(--plume\)/);
});
