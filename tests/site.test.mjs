import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
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
	for (const tag of ['Shadow army', 'Quest log', 'Tools &amp; labs', 'Player']) {
		assert.ok(tags.includes(tag), `missing [ ${tag} ] window, found: ${tags.join(', ')}`);
	}
	assert.match(html, /class="window-bar tag border-l-\[3px\] border-l-plume"[^>]*><span class="text-plume-text" aria-hidden="true">! <\/span>System message</);
	for (const heading of ['Open source', 'From the archive', 'More things I&#39;ve built', 'About', 'Contact']) {
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
	assert.match(html, /<span[^>]*>Senior Mobile (&amp;|&) Product Engineer<\/span>/);
	assert.doesNotMatch(html, />Rank</);
	assert.doesNotMatch(html, /class="window-bar tag"[^>]*>Stats</);
	assert.doesNotMatch(html, /ltm-title/);
});

test('quest cards carry a status mark derived from their period', () => {
	const html = page('/');
	const marks = [...html.matchAll(/class="mark mark-(active|cleared)"/g)].map((m) => m[1]);
	assert.equal(marks.length, 1, 'only the security library quest stays on the home page');
	assert.deepEqual(marks, ['cleared']);
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

test('/work/security-library is a quest report with no prev/next block', () => {
	const html = page('/work/security-library');
	assert.match(html, /class="window-bar tag"[^>]*>Quest info</);
	assert.match(html, /class="mark mark-(active|cleared)[^"]*"/);
	assert.doesNotMatch(html, /(Previous|Next) quest/);
});

test('figures sit in System windows', () => {
	assert.match(page('/work/security-library'), /<figure class="window[^"]*"/);
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
	// Nav slash, hero full stop, contact "!" and contact border are the only
	// red marks in the markup; corners, hover underlines and selection come from CSS.
	assert.equal((html.match(/\b(text|border-l)-plume(-text)?\b/g) ?? []).length, 4);
});

test('the hero headline ends in a red full stop', () => {
	assert.match(page('/'), /open<span class="text-plume-text">\.<\/span><\/h1>/);
});

test('case-study section headings carry the red slash signature', () => {
	assert.match(css(), /\.prose-sheet h2:{1,2}before\s*{[^}]*content:\s*"\/ "\s*\/\s*""[^}]*var\(--plume-text\)|\.prose-sheet h2:{1,2}before\s*{[^}]*var\(--plume-text\)[^}]*content:\s*"\/ "\s*\/\s*""/);
});

test('the nav marks the current page with aria-current, without JS', () => {
		assert.match(page('/work/security-library'), /<a href="\/#work"[^>]*aria-current="page"/);
	assert.doesNotMatch(page('/'), /aria-current/);
});

test('every window carries a red plume corner, and selection is red', () => {
	const all = css();
	assert.match(all, /\.window:{1,2}after\s*{[^}]*border-color:\s*var\(--plume\)/);
	assert.match(all, /::selection\s*{[^}]*background(-color)?:\s*var\(--plume\)/);
});

const jsonLd = (html) => JSON.parse(html.match(/<script type="application\/ld\+json">([^<]*)<\/script>/)[1]);

test('404 is not indexed and claims no canonical URL', () => {
	const html = page('/404');
	assert.match(html, /<meta name="robots" content="noindex">/);
	assert.doesNotMatch(html, /rel="canonical"/);
	assert.doesNotMatch(html, /og:url/);
});

test('case studies are articles, other pages are websites', () => {
	assert.match(page('/work/security-library'), /<meta property="og:type" content="article">/);
	assert.match(page('/'), /<meta property="og:type" content="website">/);
});

test('structured data: a profile page about the one person recica.dev also describes', () => {
	const data = jsonLd(page('/'));
	assert.equal(data['@type'], 'ProfilePage');
	assert.equal(data.url, 'https://drilonrecica.github.io/');
	const person = data.mainEntity;
	assert.equal(person['@type'], 'Person');
	assert.equal(person['@id'], 'https://recica.dev/#drilon');
	assert.equal(person.name, 'Drilon Reçica');
	assert.ok(person.alternateName.includes('Drilon Recica'));
	assert.equal(person.jobTitle, 'Senior Mobile & Product Engineer');
	assert.equal(person.worksFor.name, 'AppDev GmbH');
	assert.ok(person.knowsAbout.includes('Android'));
	assert.ok(person.sameAs.includes('https://recica.dev/'));
	assert.ok(person.sameAs.includes('https://x.com/drilonre'));
	assert.ok(!person.sameAs.some((url) => url.includes('twitter.com')));
	// The portrait URL must point at a file that is actually published.
	const image = new URL(person.image);
	assert.equal(image.origin, 'https://drilonrecica.github.io');
	assert.ok(existsSync(new URL(`../dist${image.pathname}`, import.meta.url)), `${image.pathname} is not in dist`);
});

test('hero h1 reads "I build things in the open" with a red full stop', () => {
	assert.match(page('/'), /<h1[^>]*>\s*I build things in the open<span class="text-plume-text">\.<\/span>\s*<\/h1>/);
});

test('home links to recica.dev at least three times, safely', () => {
	const html = page('/');
	const links = [...html.matchAll(/<a [^>]*href="https:\/\/recica\.dev\/"[^>]*>/g)].map((m) => m[0]);
	assert.ok(links.length >= 3, `found ${links.length}`);
	for (const tag of links) assert.match(tag, /target="_blank"[^>]*rel="noopener noreferrer"|rel="noopener noreferrer"[^>]*target="_blank"/);
});

test('each shadow army project lists at least two highlights', () => {
	const html = page('/');
	const lists = [...html.matchAll(/<ul class="highlights[^"]*"[^>]*>([\s\S]*?)<\/ul>/g)];
	assert.equal(lists.length, 3);
	for (const list of lists) assert.ok((list[1].match(/<li/g) ?? []).length >= 2);
});

test('tools and labs are linked as external sites', () => {
	const html = page('/');
	assert.match(html, /href="https:\/\/tools\.recica\.dev\/"/);
	assert.match(html, /href="https:\/\/labs\.recica\.dev\/"/);
});

test('home sections come in the new order', () => {
	const html = page('/');
	const order = ['id="open-source"', 'id="work"', 'id="tools"', 'id="about"', 'id="contact"'].map((id) => html.indexOf(`<section ${id}`) === -1 ? html.indexOf(id) : html.indexOf(`<section ${id}`));
	assert.ok(order.every((i) => i > 0));
	assert.deepEqual([...order].sort((a, b) => a - b), order);
});

test('nav: Projects, Archive, Tools, About and an external recica.dev', () => {
	const nav = page('/').match(/<nav[\s\S]*?<\/nav>/)[0];
	for (const href of ['/#open-source', '/#work', '/#tools', '/#about']) assert.ok(nav.includes(`href="${href}"`), href);
	assert.match(nav, /href="https:\/\/recica\.dev\/"[^>]*target="_blank"/);
	assert.match(nav, /opens in a new tab/);
});

const redirects = [
	['/cv', 'https://recica.dev/cv/'],
	['/work/deutsche-bahn', 'https://recica.dev/work/wohin-du-willst/'],
	['/work/qisara', 'https://recica.dev/work/qisara/'],
];
for (const [path, target] of redirects) {
	test(`${path} forwards to ${target}`, () => {
		const html = page(path);
		assert.ok(html.includes(`<meta http-equiv="refresh" content="0; url=${target}">`));
		assert.ok(html.includes(`<link rel="canonical" href="${target}">`));
		assert.doesNotMatch(html, /noindex/);
		assert.ok(html.includes(`href="${target}"`));
	});
}

test('sitemap lists only the home page and the one case study', () => {
	const xml = readFileSync(new URL('../dist/sitemap-0.xml', import.meta.url), 'utf8');
	const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort();
	assert.deepEqual(locs, ['https://drilonrecica.github.io/', 'https://drilonrecica.github.io/work/security-library/']);
});

test('the typo-ridden CV PDF is no longer published', () => {
	assert.ok(!existsSync(new URL('../dist/Drilon_Recica_CV.pdf', import.meta.url)));
});

test('the home page carries no CV-level claims', () => {
	const html = page('/');
	for (const phrase of ['13+ years', 'millions of users', 'six months']) assert.ok(!html.toLowerCase().includes(phrase), phrase);
	assert.doesNotMatch(html, /Track record|Hunter record|Passive skill/);
	assert.match(html, /href="https:\/\/recica\.dev\/cv\/"/);
});
