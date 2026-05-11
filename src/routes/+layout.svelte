<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { cards, columns } from '$lib/stores/store.svelte';
	import type { card, column } from '$lib/types';

	let { children } = $props();

	// Load data from local storage
	function loadDataFromLocalStorage() {
		const cards = localStorage.getItem('cards');
		const columns = localStorage.getItem('columns');

		if (!cards || !columns) {
			console.error("Couldn't load data from local storage");
			return;
		}

		try {
			const parsedCards = JSON.parse(cards);
			const parsedColumns = JSON.parse(columns);

			// console.log(parsedCards);
			// console.log(parsedColumns);

			return { cards: parsedCards, columns: parsedColumns };
		} catch (error) {
			console.error(error);
			return;
		}
	}
	// Update stores with data from local storage
	function updateStores(newCards: card[], newColumns: column[]) {
		cards.value = [...cards.value, ...newCards];
		localStorage.setItem('cards', JSON.stringify(cards.value));
		columns.value = columns.value.map((column) => {
			column.cards = cards.value
				.filter((card) => card.status === column.status)
				.map((card) => card.id);

			return column;
		});
	}

	onMount(() => {
		const data = loadDataFromLocalStorage();
		if (data) {
			updateStores(data.cards, data.columns);
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{@render children()}
