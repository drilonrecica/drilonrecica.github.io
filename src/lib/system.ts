/** Whole years since `startYear`, shown as "Level" on the status window. */
export function levelSince(startYear: number, now: Date = new Date()): number {
	return now.getFullYear() - startYear;
}

export type QuestStatus = 'active' | 'cleared';

/** A period such as "Nov 2023 – Present" is still running; any other period is finished. */
export function questStatus(period: string): QuestStatus {
	return /\b(present|now)\b/i.test(period) ? 'active' : 'cleared';
}
