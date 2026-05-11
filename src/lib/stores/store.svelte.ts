import type { card, column, status } from '$lib/types';
import { v4 as uuidv4 } from 'uuid';
import { browser } from '$app/environment';

const testCards: Partial<card>[] = [
	{
		id: 'c1b9b3b1-1b9b-4b1b-8b1b-1b9b3b1b9b3b',
		title: 'Card 1',
		description: 'This is a card'
	},
	{
		id: 'c2b9b3b2-2b9b-4b2b-8b2b-2b9b3b2b9b3b',
		title: 'Card 2',
		description: 'This is a card'
	},
	{
		id: 'c3b9b3b3-3b9b-4b3b-8b3b-3b9b3b3b9b3b',
		title: 'Card 3',
		description: 'This is a card'
	},
	{
		id: 'c4b9b3b4-4b9b-4b4b-8b4b-4b9b3b4b9b3b',
		title: 'Card 4',
		description: 'This is a card'
	}
];

const testColumns: column[] = [
	{
		id: 'col-1',
		title: 'Backlog',
		status: 'todo',
		cards: ['c1b9b3b1-1b9b-4b1b-8b1b-1b9b3b1b9b3b', 'c3b9b3b3-3b9b-4b3b-8b3b-3b9b3b3b9b3b']
	},
	{
		id: 'col-2',
		title: 'In Progress',
		status: 'in-progress',
		cards: ['c2b9b3b2-2b9b-4b2b-8b2b-2b9b3b2b9b3b']
	},
	{
		id: 'col-3',
		title: 'Done',
		status: 'done',
		cards: ['c4b9b3b4-4b9b-4b4b-8b4b-4b9b3b4b9b3b']
	}
];

class KanbanStore {
	// Use Record for O(1) lookups and better performance
	#cards = $state<Record<string, card>>({});
	#columns = $state<column[]>([]);

	constructor() {
		if (browser) {
			this.loadFromStorage();
			window.addEventListener('storage', (e) => {
				if (e.key === 'cards' || e.key === 'columns') {
					this.loadFromStorage();
				}
			});
		} else {
			this.resetToTestData();
		}
	}

	get cards() {
		return this.#cards;
	}

	get columns() {
		return this.#columns;
	}

	private saveToStorage() {
		if (browser) {
			localStorage.setItem('cards', JSON.stringify(this.#cards));
			localStorage.setItem('columns', JSON.stringify(this.#columns));
		}
	}

	private loadFromStorage() {
		const savedCards = localStorage.getItem('cards');
		const savedColumns = localStorage.getItem('columns');
		
		if (savedCards && savedColumns) {
			try {
				this.#cards = JSON.parse(savedCards);
				this.#columns = JSON.parse(savedColumns);
			} catch (e) {
				console.error('Failed to parse Kanban data from localStorage', e);
				this.resetToTestData();
			}
		} else {
			this.resetToTestData();
		}
	}

	private resetToTestData() {
		this.#cards = {};
		testCards.forEach(c => this.#cards[c.id!] = c as card);
		this.#columns = JSON.parse(JSON.stringify(testColumns));
	}

	addNewCard(columnId: string, title: string = 'New Card', description: string = '') {
		const id = uuidv4();
		const newCard: card = {
			id,
			title,
			description
		};

		this.#cards[id] = newCard;
		this.#columns = this.#columns.map((column) => {
			if (column.id === columnId) {
				return { ...column, cards: [...column.cards, id] };
			}
			return column;
		});

		this.saveToStorage();
	}

	updateCard(id: string, updates: Partial<card>) {
		if (this.#cards[id]) {
			this.#cards[id] = { ...this.#cards[id], ...updates };
			this.saveToStorage();
		}
	}

	deleteCard(cardId: string) {
		delete this.#cards[cardId];
		this.#columns = this.#columns.map((column) => ({
			...column,
			cards: column.cards.filter((id) => id !== cardId)
		}));

		this.saveToStorage();
	}

	moveCard(cardId: string, targetColumnId: string, newIndex: number) {
		const sourceColumn = this.#columns.find((col) => col.cards.includes(cardId));
		const targetColumn = this.#columns.find((col) => col.id === targetColumnId);

		if (!sourceColumn || !targetColumn) return;

		if (sourceColumn.id === targetColumnId) {
			// Same column move
			const oldIndex = sourceColumn.cards.indexOf(cardId);
			if (oldIndex === newIndex) return;

			const newCards = [...sourceColumn.cards];
			newCards.splice(oldIndex, 1);
			newCards.splice(newIndex, 0, cardId);
			sourceColumn.cards = newCards;
		} else {
			// Cross column move
			sourceColumn.cards = sourceColumn.cards.filter((id) => id !== cardId);
			targetColumn.cards.splice(newIndex, 0, cardId);
		}

		this.saveToStorage();
	}

	addColumn(title: string = 'New Column') {
		const id = uuidv4();
		const newColumn: column = {
			id,
			title,
			status: 'todo', // Default status
			cards: []
		};

		this.#columns.push(newColumn);
		this.saveToStorage();
	}

	updateColumn(id: string, updates: Partial<column>) {
		const index = this.#columns.findIndex((col) => col.id === id);
		if (index !== -1) {
			this.#columns[index] = { ...this.#columns[index], ...updates };
			this.saveToStorage();
		}
	}

	deleteColumn(columnId: string) {
		const column = this.#columns.find((col) => col.id === columnId);
		if (!column) return;

		// Remove all cards associated with this column
		column.cards.forEach((cardId) => {
			delete this.#cards[cardId];
		});

		// Remove the column
		this.#columns = this.#columns.filter((col) => col.id !== columnId);
		this.saveToStorage();
	}

	moveColumn(columnId: string, newIndex: number) {
		const oldIndex = this.#columns.findIndex((col) => col.id === columnId);
		if (oldIndex === -1 || oldIndex === newIndex) return;

		const newColumns = [...this.#columns];
		const [movedColumn] = newColumns.splice(oldIndex, 1);
		newColumns.splice(newIndex, 0, movedColumn);
		this.#columns = newColumns;
		this.saveToStorage();
	}
}

export const kanbanStore = new KanbanStore();
