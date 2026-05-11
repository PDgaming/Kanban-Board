<script lang="ts">
	import { draggable, droppable, type DragDropState } from '@thisux/sveltednd';
	import { kanbanStore } from '$lib/stores/store.svelte';
	import Icon from '@iconify/svelte';

	const { id, title, description, columnId } = $props();

	let editTitle = $state(title);
	let editDescription = $state(description);
	let editDialog = $state<HTMLDialogElement>();
	let deleteDialog = $state<HTMLDialogElement>();

	function handleDrop(state: DragDropState<string>) {
		const { draggedItem, targetContainer, dropPosition } = state;

		if (!targetContainer) return;

		const targetCol = kanbanStore.columns.find((c) => c.id === targetContainer);
		if (!targetCol) return;

		let newIndex = targetCol.cards.indexOf(id);
		if (dropPosition === 'after') {
			newIndex++;
		}

		kanbanStore.moveCard(draggedItem, targetContainer, newIndex);
	}

	function handleUpdate() {
		if (!editTitle.trim()) return;
		kanbanStore.updateCard(id, {
			title: editTitle,
			description: editDescription
		});
		editDialog?.close();
	}

	// Sync local state when props change (e.g. if another component updates the store)
	$effect(() => {
		editTitle = title;
		editDescription = description;
	});
</script>

<div
	class="card bg-base-200 select-none card-border"
	use:draggable={{ container: columnId, dragData: id }}
	use:droppable={{ container: columnId, callbacks: { onDrop: handleDrop } }}
>
	<div class="card-body p-3 md:p-4">
		<div class="card-header flex items-center justify-between gap-2">
			<h2 class="card-title text-xs md:text-sm font-bold truncate">{title}</h2>
			<div class="flex gap-1">
				<button class="btn btn-ghost btn-xs p-0.5 md:p-1" onclick={() => editDialog?.showModal()}>
					<Icon icon="material-symbols:edit" class="h-3.5 w-3.5 md:h-4 md:w-4" />
				</button>
				<button class="btn btn-ghost btn-xs p-0.5 md:p-1 text-error" onclick={() => deleteDialog?.showModal()}>
					<Icon icon="material-symbols:delete" class="h-3.5 w-3.5 md:h-4 md:w-4" />
				</button>
			</div>
		</div>
		{#if description}
			<p class="mt-1 md:mt-2 text-[10px] md:text-xs opacity-70 line-clamp-3">
				{description}
			</p>
		{/if}
	</div>
</div>

<dialog bind:this={editDialog} class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Edit Task</h3>
		<div class="py-4">
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text">Task Title</span>
				</div>
				<input
					type="text"
					placeholder="Enter task title..."
					class="input input-bordered w-full"
					bind:value={editTitle}
				/>
			</label>
			<label class="form-control w-full mt-4">
				<div class="label">
					<span class="label-text">Description</span>
				</div>
				<textarea
					class="textarea textarea-bordered h-24 w-full"
					placeholder="Enter task description..."
					bind:value={editDescription}
				></textarea>
			</label>
		</div>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn btn-primary" onclick={handleUpdate}>Save Changes</button>
				<button class="btn">Cancel</button>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<dialog bind:this={deleteDialog} class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Confirm Deletion</h3>
		<p class="py-4">Are you sure you want to delete <strong>{title}</strong>? This action cannot be undone.</p>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn btn-error" onclick={() => kanbanStore.deleteCard(id)}>Delete</button>
				<button class="btn">Cancel</button>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<style>
	:global(.dragging) {
		opacity: 0.5;
	}
</style>
