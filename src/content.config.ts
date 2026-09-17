import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const work = defineCollection({
	loader: glob({ pattern: '**/*.mdx', base: './src/content/work' }),
	schema: z.object({
		title: z.string(),
		client: z.string(),
		role: z.string(),
		period: z.string(),
		team: z.string().optional(),
		platform: z.string(),
		stack: z.array(z.string()),
		links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
		summary: z.string(),
		order: z.number(),
		// Drafts are excluded from production builds until their facts are confirmed.
		draft: z.boolean().default(false),
	}),
});

export const collections = { work };
