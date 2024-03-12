<script>
    import { createEventDispatcher } from "svelte";
    let dispatch = createEventDispatcher();

    function closeModal() {
        dispatch("closeModal");
    }
</script>


<div class="fixed z-60 h-full w-full flex items-center justify-center">
    <div class="bg-primary-400 w-4/6 shadow-lg rounded-lg p-4">
        <p class="text-center text-primary-900 pb-4">Review Submitted!</p>
        <p class="text-primary-800 border-b border-primary-900 mb-4 py-4 pb-8">Your review has been submitted, we thank you for your input!</p>
        <div class="flex justify-center">
            <button on:click={closeModal} class="text-primary-700 font-bold uppercase px-4 py-2 bg-primary-900 rounded-lg hover:bg-primary-800 hover:text-primary-600">Close</button>
        </div>
    </div>
</div>