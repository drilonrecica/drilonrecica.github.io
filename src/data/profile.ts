export interface ProfileLink {
	label: string;
	href: string;
	icon: "github" | "linkedin" | "stackoverflow" | "x" | "email";
}

export const profile = {
	name: "Drilon Reçica",
	title: "Senior Mobile Engineer",
	email: "drilonrecica.dev@gmail.com",
	cvPdf: "/Drilon_Recica_CV.pdf",
	/** Path under `public/`, e.g. "/drilon-recica.jpg". The About photo is omitted until this is set. */
	photo: undefined as string | undefined,
	description:
		"Senior mobile engineer working with Android, Flutter and backend systems since 2012. I modernize large production apps and build products from zero.",
	headline: "I modernize mobile apps that millions of people rely on.",
	intro:
		"Senior mobile engineer, building for Android since 2012. I move large production apps from legacy architecture to modern Kotlin without stopping delivery, and I have taken a product from idea to launch across app, backend and infrastructure.",
	summary:
		"Senior mobile and software engineer with 13+ years of professional experience, focused on Android, Flutter and modern backend systems. Started Android development in 2012 and grew alongside the platform, adapting to new architectures, tooling and engineering standards as the ecosystem evolved.",
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
		{ label: "X", href: "https://twitter.com/drilonre", icon: "x" },
	] satisfies ProfileLink[],
	education: [
		{ period: "2012 – 2014", place: "University for Business & Technology", title: "Computer Sciences" },
		{ period: "2016", place: "androidatc.com", title: "Android Certified Application Engineer" },
	],
};
