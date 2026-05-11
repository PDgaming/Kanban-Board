<script lang="ts">
	import { columns } from '$lib/stores/store.svelte';
	import Column from './components/column.svelte';
</script>

<div class="flex h-screen flex-col gap-3">
	<div class="title">
		<h1 class="rounded bg-base-300 px-2 py-7 text-3xl font-bold">
			<a href="/" class="rounded-xl bg-primary p-3 text-primary-content"> Kanban Board </a>
		</h1>
	</div>

	<div class="body flex justify-between gap-3 rounded-xl bg-base-200 p-4">
		{#each columns.value as column}
			<Column id={column.id} title={column.title} status={column.status} cardIds={column.cards} />
		{/each}
	</div>
</div>
