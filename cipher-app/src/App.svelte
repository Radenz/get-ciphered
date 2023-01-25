<script lang="ts">
	export let name: string;
</script>

<main>
	<h1>Cipherin Aja!</h1>
	<input type="textbox">
	<p>Or</p>
	<input type="file">
	<div>
		<input type="button" value="encrypt">
		<input type="button" value="decrypt">
	</div>
	
	<input type="textbox" disabled>
	<p>Or</p>
	<button >download</button>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>