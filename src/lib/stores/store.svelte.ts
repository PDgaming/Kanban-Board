import type { card, column } from '$lib/types';

let testCards: card[] = [
	{
		id: '1',
		title: 'Card 1',
		description: 'This is a card',
		status: 'todo'
	},
	{
		id: '2',
		title: 'Card 2',
		description: 'This is a card',
		status: 'in-progress'
	},
	{
		id: '3',
		title: 'Card 3',
		description: 'This is a card',
		status: 'todo'
	},
	{
		id: '4',
		title: 'Card 4',
		description: 'This is a card',
		status: 'done'
	}
];

let testColumns: column[] = [
	{
		id: '1',
		title: 'Backlog',
		status: 'todo',
		cards: ['1', '3']
	},
	{
		id: '2',
		title: 'In Progress',
		status: 'in-progress',
		cards: ['2']
	},
	{
		id: '3',
		title: 'Done',
		status: 'done',
		cards: ['4']
	}
];

export let cards: { value: card[] } = $state({ value: testCards });

export let columns: { value: column[] } = $state({ value: testColumns });
