<script lang="ts">
	import { cards, columns } from '$lib/stores/store.svelte';
	import Icon from '@iconify/svelte';

	const { id, title, description, status } = $props();

	function deleteCard() {
		columns.value = columns.value.filter((column) => {
			if (column.cards.includes(id)) {
				column.cards = column.cards.filter((cardId) => cardId !== id);
				return column;
			}
			return column;
		});

		cards.value = cards.value.filter((card) => card.id !== id);
		localStorage.setItem('columns', JSON.stringify(columns.value));
		localStorage.setItem('cards', JSON.stringify(cards.value));
	}
</script>

<div class="card bg-base-200 select-none card-border">
	<div class="card-body">
		<div class="card-header flex items-center justify-between">
			<h2 class="card-title">{title}</h2>
			<button class="btn btn-ghost" onclick={deleteCard}>
				<Icon icon="material-symbols:delete" class="h-5 w-5" />
			</button>
		</div>
		<p>
			{description}
		</p>
	</div>
</div>
