<script>
	import Authorization from './auth/+page.svelte'
	import Navigation from './navigation/+page.svelte'
	import { page } from '$app/stores'
</script>

{#if $page.data.session?.user}
	<div class="h-screen">
		<div class="h-1/6">
			<Navigation />
		</div>

		<div class="h-5/6 flex justify-center items-center">
			<p class="text-5xl font-bold text-center px-4">Welcome to my fullstack Svelte app!</p>
		</div>
	</div>
{:else}
	<Authorization />
{/if}