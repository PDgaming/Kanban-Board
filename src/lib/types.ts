export type status = 'todo' | 'in-progress' | 'done';

export interface card {
	id: string; // Use UUIDs
	title: string;
	description: string;
}

export interface column {
	id: string; // Use UUIDs
	title: string;
	status: status;
	cards: card['id'][];
}
