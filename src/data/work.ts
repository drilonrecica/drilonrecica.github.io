import { getCollection } from 'astro:content';

/** Published case studies in display order. Drafts are visible in `astro dev` only. */
export async function getWork() {
	const entries = await getCollection('work', ({ data }) => import.meta.env.DEV || !data.draft);
	return entries.sort((a, b) => a.data.order - b.data.order);
}
