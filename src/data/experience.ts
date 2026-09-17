export interface Project {
	name: string;
	period: string;
	summary: string;
	url?: string;
	/** Slug of a case study in the `work` collection, if one exists. */
	caseStudy?: string;
}

export interface Employer {
	company: string;
	role: string;
	period: string;
	start: number;
	/** `null` means ongoing. */
	end: number | null;
	summary: string;
	stack: string[];
	projects: Project[];
}

// Single source of truth for roles and dates; feeds the home timeline and /cv.
export const experience: Employer[] = [
	{
		company: "AppDev GmbH",
		role: "Senior Android Developer",
		period: "2020 – Present",
		start: 2020,
		end: null,
		summary:
			"Large-scale public transport and retail apps, built in cross-disciplinary agile teams across Android, iOS and backend. Key role in modernizing architectures, migrating from MVP/RxJava to MVVM with Coroutines and Flow, and improving accessibility and UI quality. Multi-module development, white-label solutions and CI/CD for production apps with millions of users.",
		stack: ["Kotlin", "Jetpack Compose", "Coroutines", "Flow", "MVVM", "RxJava", "CI/CD"],
		projects: [
			{
				name: "Deutsche Bahn – Wohin Du Willst",
				period: "Nov 2023 – Present",
				summary: "Architecture migration, WCAG accessibility rework and modularization.",
				url: "https://play.google.com/store/apps/details?id=de.dbregio.wohinduwillst",
				caseStudy: "deutsche-bahn",
			},
			{
				name: "Edeka",
				period: "Aug 2022 – Nov 2023",
				summary: "Retail app with Scan & Go: barcode scanning, payment and loyalty features.",
				url: "https://play.google.com/store/apps/details?id=de.edeka.genuss",
			},
			{
				name: "RMVGo",
				period: "Jun 2020 – Aug 2022",
				summary: "Ticketing and mobility services for the Rhein-Main transit region.",
				url: "https://play.google.com/store/apps/details?id=com.cubic.rmvgo",
			},
		],
	},
	{
		company: "DeenLabs GmbH",
		role: "Tech Lead & Senior Software Engineer",
		period: "2023 – 2024",
		start: 2023,
		end: 2024,
		summary:
			"Early-stage startup member. Led ideation, architecture and end-to-end implementation of Qisara: a Deno and TypeScript backend, infrastructure on a VPS with Coolify, and the Flutter app from scratch, including navigation, localization, payments and persistence.",
		stack: ["Flutter", "Dart", "Deno", "TypeScript", "Coolify", "RevenueCat"],
		projects: [
			{
				name: "Qisara",
				period: "2023 – 2024",
				summary: "A mobile product taken from idea to launch with full technical ownership.",
				url: "https://qisara.com/",
				caseStudy: "qisara",
			},
		],
	},
	{
		company: "Adrsys GmbH & Co. KG",
		role: "Senior Android Developer",
		period: "2015 – 2020",
		start: 2015,
		end: 2020,
		summary:
			"Android apps in fintech and insurance, in agile interdisciplinary teams, with architectural setup in Kotlin and Java using MVP and MVVM. Built internal Flutter apps in 2019, maintained an open-source Android security library and mentored four working students.",
		stack: ["Kotlin", "Java", "MVP", "MVVM", "Flutter"],
		projects: [
			{
				name: "easyCredit / Fymio",
				period: "2015 – 2020",
				summary: "Finance app with complex business logic and strict security requirements.",
				url: "https://appadvice.com/app/fymio-die-smarte-finanzapp/1113006823",
			},
			{
				name: "Ergo Direkt",
				period: "2015 – 2020",
				summary: "Insurance policy and claims management.",
				url: "https://play.google.com/store/apps/details?id=de.ergo.app",
			},
			{
				name: "Open-source Android security library",
				period: "2015 – 2020",
				summary: "Built and maintained alongside client work.",
				caseStudy: "security-library",
			},
		],
	},
];

export const stackGroups = [
	{ name: "Android", items: ["Kotlin", "Coroutines", "Flow", "Jetpack Compose", "MVVM", "MVI", "Room", "Retrofit"] },
	{ name: "Flutter", items: ["Dart", "go_router", "provider", "dio", "hive", "easy_localization", "RevenueCat"] },
	{ name: "Backend", items: ["Deno", "TypeScript", "Node.js", "Go", "PostgreSQL", "Redis", "SQLite", "Supabase", "PocketBase"] },
	{ name: "Delivery", items: ["GitHub Actions", "GitLab CI", "Docker", "Coolify"] },
];
