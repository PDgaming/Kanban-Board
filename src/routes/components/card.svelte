<script lang="ts">
	const { id, title, description, status } = $props();
</script>

<div class="card bg-base-200 select-none card-border">
	<div class="card-body">
		<h2 class="card-title">{title}</h2>
		<p>
			{description}
		</p>
	</div>
</div>
