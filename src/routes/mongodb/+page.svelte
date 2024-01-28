<script lang="ts">
    export let data: any

    $: console.log(data.body.message)
</script>

<div class="bg-red-100 px-2 py-4">
    <h1 class="font-bold text-center text-red-400">{data.body.message}</h1>
</div>