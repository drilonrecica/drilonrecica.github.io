export interface ProfileLink {
	label: string;
	href: string;
	icon: "github" | "linkedin" | "stackoverflow" | "x" | "email";
}

export const profile = {
	name: "Drilon Reçica",
	title: "Senior Mobile & Product Engineer",
	/** Flagship personal site; its structured data owns the canonical Person entity (`${home}#drilon`). */
	home: "https://recica.dev/",
	/** Spelling without the cedilla, as people often type it into search. */
	alternateName: "Drilon Recica",
	/** Topics shown on this site (experience, case studies, principles), for structured data. */
	knowsAbout: ["Android", "Kotlin", "Jetpack Compose", "Flutter", "Mobile app architecture", "Accessibility"],
	/** First year building for Android; the status window's Level counts from here. */
	androidSince: 2012,
	email: "drilonrecica.dev@gmail.com",
	cvPdf: "/Drilon_Recica_CV.pdf",
	description:
		"Open source, side projects and experiments by Drilon Reçica, Senior Mobile & Product Engineer. Professional profile and CV at recica.dev.",
	headline: "I build things in the open.",
	intro:
		"Open source, side projects and experiments by a Senior Mobile & Product Engineer who has been building for Android since 2012. For my professional profile, case studies and CV, visit recica.dev.",
	summary:
		"I am a senior mobile and product engineer, building for Android since 2012 and working across Android, Flutter and backend systems. This site is where my side projects and open-source work live. My professional background, case studies and CV are on recica.dev.",
	languages: ["German", "English", "Albanian"],
	proof: [
		{ value: "2012", label: "Building for Android since" },
		{ value: "Millions", label: "of users on production apps I maintain" },
		{ value: "0 to 1", label: "Led Qisara from idea to launch" },
		{ value: "4", label: "working students mentored" },
	],
	links: [
		{ label: "GitHub", href: "https://github.com/drilonrecica", icon: "github" },
		{ label: "LinkedIn", href: "https://www.linkedin.com/in/drilonrecica", icon: "linkedin" },
		{ label: "Stack Overflow", href: "https://stackoverflow.com/users/3392276", icon: "stackoverflow" },
		{ label: "X", href: "https://x.com/drilonre", icon: "x" },
	] satisfies ProfileLink[],
	education: [
		{ period: "2012 – 2014", place: "University for Business & Technology", title: "Computer Sciences" },
		{ period: "2016", place: "androidatc.com", title: "Android Certified Application Engineer" },
	],
};
