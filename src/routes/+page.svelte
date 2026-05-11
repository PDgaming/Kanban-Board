<script lang="ts">
	import { kanbanStore } from '$lib/stores/store.svelte';
	import Column from './components/column.svelte';
	import Icon from '@iconify/svelte';
	import { droppable, type DragDropState } from '@thisux/sveltednd';

	function handleColumnDrop(state: DragDropState<string>) {
		const { draggedItem, targetContainer, dropPosition } = state;
		if (targetContainer !== 'board') return;

		const draggedColId = draggedItem;
		// Since we're dropping on the board container, we need to find the target index
		// For simplicity in this first pass, we'll implement reordering in the Column component
		// but the board needs to be droppable to allow moving columns.
	}
</script>

<div class="flex h-screen flex-col gap-3 p-2 md:p-4">
	<div class="title">
		<h1 class="rounded bg-base-300 px-2 py-4 md:py-7 text-2xl md:text-3xl font-bold">
			<a href="/" class="rounded-xl bg-primary p-2 md:p-3 text-primary-content"> Kanban Board </a>
		</h1>
	</div>

	<div
		class="body flex h-full items-start gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory rounded-xl bg-base-200 p-2 md:p-4"
		use:droppable={{
			container: 'board',
			callbacks: { onDrop: handleColumnDrop }
		}}
	>
		{#each kanbanStore.columns as column (column.id)}
			<div class="h-full min-w-[85vw] max-w-[85vw] md:min-w-[300px] md:max-w-[500px] md:flex-1 snap-center">
				<Column id={column.id} title={column.title} status={column.status} cardIds={column.cards} />
			</div>
		{/each}

		<button
			class="btn btn-ghost h-full min-w-[85vw] max-w-[85vw] md:min-w-[250px] md:max-w-[250px] md:flex-none snap-center border-2 border-dashed border-base-300 bg-base-100 flex-col gap-2 hover:border-primary hover:bg-base-200"
			onclick={() => kanbanStore.addColumn()}
		>
			<Icon icon="ic:baseline-add-circle-outline" class="h-10 w-10 opacity-50" />
			<span class="text-lg font-bold opacity-50">Add New Column</span>
		</button>
	</div>
</div>
