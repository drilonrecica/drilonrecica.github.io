export interface OpenSourceProject {
	name: string;
	summary: string;
	/** Two or three short phrases (60 characters at most), each verifiable in the project's README. */
	highlights: string[];
	stack: string[];
	/** Short maturity label. Version numbers are left out because they go stale. */
	status?: string;
	/** Plays the "Arise." flourish: igris is the shadow this site's owner raised. */
	arise?: boolean;
	links: { label: string; href: string; icon: "github" | "external" }[];
}

// Side projects on GitHub, described from their public READMEs.
export const openSource: OpenSourceProject[] = [
	{
		name: "igris",
		summary:
			"Runs a markdown project plan one task at a time, each in a fresh Claude Code session started with the model the plan assigns. Deterministic, strictly sequential, and it waits for you whenever a task needs a decision.",
		highlights: ["Strictly sequential, one task at a time", "A fresh Claude Code session for every task", "The model for each task comes from your plan"],
		stack: ["Go", "CLI", "tmux", "herdr"],
		status: "Released",
		arise: true,
		links: [
			{ label: "GitHub", href: "https://github.com/drilonrecica/igris", icon: "github" },
			{ label: "Website", href: "https://drilonrecica.github.io/igris/", icon: "external" },
		],
	},
	{
		name: "Scouter",
		summary:
			"A retired Android phone on the desk shows the CI status of my most active GitHub repos as a HUD, with the notification LED as a build light. The Kotlin app has no dependencies and ships as a ~150 KB APK; a small Go service polls GitHub and streams updates to it.",
		highlights: ["Notification LED doubles as a build light", "Android app with no dependencies, ~150 KB APK", "Go aggregator on the standard library only"],
		stack: ["Kotlin", "Android", "Go", "Server-Sent Events"],
		links: [{ label: "GitHub", href: "https://github.com/drilonrecica/scouter", icon: "github" }],
	},
	{
		name: "Nise & Go",
		summary:
			"An opinionated, security-first application foundation for Go, chi, PostgreSQL and SvelteKit. Deterministic generators produce plain, application-owned code instead of runtime magic.",
		highlights: ["Deterministic generators", "One Go binary: API, jobs, migrations, frontend", "Secure defaults fail closed"],
		stack: ["Go", "PostgreSQL", "SvelteKit", "OpenAPI"],
		status: "Pre-alpha",
		links: [{ label: "GitHub", href: "https://github.com/drilonrecica/nise-and-go", icon: "github" }],
	},
];

export interface BuiltElsewhere {
	name: string;
	host: string;
	summary: string;
	href: string;
}

// Products on recica.dev subdomains, described from their READMEs.
export const builtElsewhere: BuiltElsewhere[] = [
	{
		name: "Recica Tools",
		host: "tools.recica.dev",
		summary: "Privacy-first browser tools for developers. Input is processed locally in your browser whenever practical.",
		href: "https://tools.recica.dev/",
	},
	{
		name: "Recica Labs",
		host: "labs.recica.dev",
		summary: "Interactive prototypes and public product experiments.",
		href: "https://labs.recica.dev/",
	},
];
