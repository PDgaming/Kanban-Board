<script lang="ts">
	import { cards, columns } from '$lib/stores/store.svelte';
	import type { card, status as statusType } from '$lib/types';
	import { onMount } from 'svelte';
	import Card from './card.svelte';
	import Icon from '@iconify/svelte';
	import { v4 as uuidv4 } from 'uuid';

	const { id, title, status, cardIds } = $props();
	let cardsList = $derived(
		cards.value.filter((card) => {
			if (cardIds.includes(card.id)) {
				return card;
			}
		})
	);

	function addNewCard(status: statusType) {
		const newCard: card = {
			id: uuidv4(),
			title: 'Test  Card',
			description: '',
			status: status
		};
		cards.value = [...cards.value, newCard];
		columns.value = columns.value.map((column) => {
			if (column.status === newCard.status) {
				column.cards = [...column.cards, newCard.id];
				return column;
			}
			return column;
		});
		localStorage.setItem('cards', JSON.stringify(cards.value));
		localStorage.setItem('columns', JSON.stringify(columns.value));
	}

	$effect(() => {
		console.log(cardsList);
	});
</script>

<div class="h-full w-full rounded-xl bg-base-300">
	<div class="title flex items-center justify-between p-3">
		<span
			class={`text-xl ${status === 'todo' ? 'text-info' : status === 'in-progress' ? 'text-warning' : 'text-success'} font-bold`}
		>
			{title}
		</span>
		<button class="btn p-2 btn-ghost" onclick={() => addNewCard(status)}>
			<Icon icon="ic:baseline-add" class="h-6 w-6" />
		</button>
	</div>

	<div
		class="cards-container flex h-screen flex-col gap-3 overflow-y-scroll rounded-b-xl bg-base-100 p-3"
	>
		{#if cardsList.length && cardsList.length > 0}
			{#each cardsList as card}
				<Card id={card.id} title={card.title} description={card.description} status={card.status} />
			{/each}
		{:else}
			<span>No Tasks</span>
		{/if}
	</div>
</div>
