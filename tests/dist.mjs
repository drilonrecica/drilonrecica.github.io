import { readFileSync, readdirSync } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);

/** Built HTML for a route such as '/', '/work/security-library' or '/404'. Run `npm run build` first. */
export function page(path) {
	const file = path === '/' ? 'index.html' : path === '/404' ? '404.html' : `${path.replace(/^\//, '')}/index.html`;
	return readFileSync(new URL(file, dist), 'utf8');
}

/** All built CSS: bundled files plus any stylesheet Astro inlined into the home page. */
export function css() {
	const dir = new URL('_astro/', dist);
	const files = readdirSync(dir).filter((name) => name.endsWith('.css'));
	const inlined = [...page('/').matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
	return [...files.map((name) => readFileSync(new URL(name, dir), 'utf8')), ...inlined].join('\n');
}

/** `text` with every `@name … { … }` block removed, braces matched. */
export function stripAtRule(text, name) {
	let out = '';
	let i = 0;
	while (i < text.length) {
		const start = text.indexOf(name, i);
		if (start === -1) return out + text.slice(i);
		out += text.slice(i, start);
		let j = text.indexOf('{', start);
		let depth = 1;
		while (depth > 0 && ++j < text.length) {
			if (text[j] === '{') depth++;
			else if (text[j] === '}') depth--;
		}
		i = j + 1;
	}
	return out;
}
