import { cards } from '$lib/stores/store.svelte';
import type { card } from '$lib/types';

// Add Card
export function addCard(newCard: card) {
	cards.value.push(newCard);
	localStorage.setItem('cards', JSON.stringify(cards.value));
}

// Delete Card
export function deleteCard(cardId: string) {
	const newCards = cards.value.filter((card) => card.id !== cardId);
	localStorage.setItem('cards', JSON.stringify(newCards));
}

// Edit Card
export function editCard(cardId: string, newCard: card) {
	const newCards = cards.value.map((card) => {
		if (card.id === cardId) {
			return newCard;
		}
		return card;
	});
	localStorage.setItem('cards', JSON.stringify(newCards));
}
