export interface Employer {
	company: string;
}

/** The current employer, read by the status window and the structured data. The full history lives on recica.dev. */
export const experience: Employer[] = [{ company: "AppDev GmbH" }];
