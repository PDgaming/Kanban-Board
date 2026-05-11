<script lang="ts">
	import { kanbanStore } from '$lib/stores/store.svelte';
	import type { card, status as statusType } from '$lib/types';
	import Card from './card.svelte';
	import Icon from '@iconify/svelte';
	import { draggable, droppable, type DragDropState } from '@thisux/sveltednd';

	const { id, title, status, cardIds } = $props();
	let cardsList = $derived(cardIds.map((id: string) => kanbanStore.cards[id]).filter(Boolean));

	let newCardTitle = $state('');
	let newCardDescription = $state('');
	let addCardDialog = $state<HTMLDialogElement>();

	let editColumnTitle = $state(title);
	let editColumnDialog = $state<HTMLDialogElement>();
	let deleteColumnDialog = $state<HTMLDialogElement>();

	function handleAddCard() {
		if (!newCardTitle.trim()) return;

		kanbanStore.addNewCard(id, newCardTitle, newCardDescription);

		// Reset and close
		newCardTitle = '';
		newCardDescription = '';
		addCardDialog?.close();
	}

	function handleUpdateColumn() {
		if (!editColumnTitle.trim()) return;
		kanbanStore.updateColumn(id, { title: editColumnTitle });
		editColumnDialog?.close();
	}

	function handleColumnDrop(state: DragDropState<string>) {
		const { draggedItem, targetContainer, dropPosition } = state;
		if (!targetContainer) return;

		// Handle Column Reordering
		if (targetContainer === 'board') {
			const targetIndex = kanbanStore.columns.findIndex((c) => c.id === id);
			let newIndex = targetIndex;
			if (dropPosition === 'after') {
				newIndex++;
			}
			kanbanStore.moveColumn(draggedItem, newIndex);
			return;
		}

		// Handle Card Drop on Column Background
		if (targetContainer === id) {
			const targetCol = kanbanStore.columns.find((c) => c.id === id);
			if (!targetCol) return;
			kanbanStore.moveCard(draggedItem, id, targetCol.cards.length);
		}
	}

	// Sync local state when props change
	$effect(() => {
		editColumnTitle = title;
	});
</script>

<div
	class="flex max-h-[70vh] w-full flex-col rounded-xl bg-base-300 shadow-lg transition-all md:max-h-full"
	use:droppable={{
		container: 'board',
		callbacks: { onDrop: handleColumnDrop }
	}}
>
	<div class="title flex items-center justify-between border-b border-base-content/10 p-2 md:p-3">
		<div
			class="flex items-center gap-1 overflow-hidden md:gap-2"
			use:draggable={{ container: 'board', dragData: id }}
		>
			<Icon
				icon="material-symbols:drag-indicator"
				class="h-4 w-4 cursor-grab opacity-30 active:cursor-grabbing md:h-5 md:w-5"
			/>
			<span
				class={`truncate text-lg font-bold md:text-xl ${status === 'todo' ? 'text-info' : status === 'in-progress' ? 'text-warning' : 'text-success'}`}
			>
				{title}
			</span>
		</div>
		<div class="flex gap-1">
			<button class="btn p-1 btn-ghost btn-xs md:btn-sm" onclick={() => addCardDialog?.showModal()}>
				<Icon icon="ic:baseline-add" class="h-4 w-4 md:h-5 md:w-5" />
			</button>
			<div class="dropdown dropdown-end">
				<button tabindex="0" class="btn p-1 btn-ghost btn-xs md:btn-sm">
					<Icon icon="material-symbols:more-vert" class="h-4 w-4 md:h-5 md:w-5" />
				</button>
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<ul
					tabindex="0"
					class="dropdown-content menu z-[1] w-48 rounded-box bg-base-100 p-2 shadow md:w-52"
				>
					<li>
						<button onclick={() => editColumnDialog?.showModal()}>
							<Icon icon="material-symbols:edit" /> Rename Column
						</button>
					</li>
					<li>
						<button class="text-error" onclick={() => deleteColumnDialog?.showModal()}>
							<Icon icon="material-symbols:delete" /> Delete Column
						</button>
					</li>
				</ul>
			</div>
		</div>
	</div>

	<div
		class="cards-container flex flex-1 flex-col gap-2 overflow-y-auto rounded-b-xl bg-base-100 p-2 md:gap-3 md:p-3"
		use:droppable={{
			container: id,
			callbacks: { onDrop: handleColumnDrop }
		}}
	>
		{#if cardsList.length > 0}
			{#each cardsList as card}
				<Card id={card.id} title={card.title} description={card.description} columnId={id} />
			{/each}
		{:else}
			<div class="flex h-32 items-center justify-center opacity-30">
				<span>No Tasks</span>
			</div>
		{/if}
	</div>
</div>

<!-- Add Card Dialog -->
<dialog bind:this={addCardDialog} class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Add New Task to {title}</h3>
		<div class="py-4">
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Task Title</span>
				</div>
				<input
					type="text"
					placeholder="Enter task title..."
					class="input-bordered input w-full"
					bind:value={newCardTitle}
				/>
			</label>
			<label class="form-control mt-4 w-full">
				<div class="label">
					<span class="label-text">Description</span>
				</div>
				<textarea
					class="textarea-bordered textarea h-24 w-full"
					placeholder="Enter task description..."
					bind:value={newCardDescription}
				></textarea>
			</label>
		</div>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn btn-primary" onclick={handleAddCard}>Add Task</button>
				<button class="btn">Cancel</button>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<!-- Edit Column Dialog -->
<dialog bind:this={editColumnDialog} class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Rename Column</h3>
		<div class="py-4">
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Column Title</span>
				</div>
				<input
					type="text"
					placeholder="Enter column title..."
					class="input-bordered input w-full"
					bind:value={editColumnTitle}
				/>
			</label>
		</div>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn btn-primary" onclick={handleUpdateColumn}>Rename</button>
				<button class="btn">Cancel</button>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<!-- Delete Column Dialog -->
<dialog bind:this={deleteColumnDialog} class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Confirm Column Deletion</h3>
		<p class="py-4">
			Are you sure you want to delete the column <strong>{title}</strong> and all its tasks? This action
			cannot be undone.
		</p>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn btn-error" onclick={() => kanbanStore.deleteColumn(id)}
					>Delete Column</button
				>
				<button class="btn">Cancel</button>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
