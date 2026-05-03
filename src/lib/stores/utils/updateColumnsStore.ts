import { columns } from '$lib/stores/store.svelte';
import type { column } from '$lib/types';

// Add Card
export function addCard(newColumn: column) {
	columns.value.push(newColumn);
	localStorage.setItem('columns', JSON.stringify(columns.value));
}

// Delete Card
export function deleteCard(columnId: string) {
	const newColumns = columns.value.filter((column) => column.id !== columnId);
	localStorage.setItem('columns', JSON.stringify(newColumns));
}

// Edit Card
export function editCard(columnId: string, newColumn: column) {
	const newColumns = columns.value.map((column) => {
		if (column.id === columnId) {
			return newColumn;
		}
		return column;
	});
	localStorage.setItem('columns', JSON.stringify(newColumns));
}
