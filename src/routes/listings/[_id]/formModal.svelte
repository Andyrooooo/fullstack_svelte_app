<script>
    import { createEventDispatcher } from "svelte";
    let dispatch = createEventDispatcher();

    function closeModal() {
        dispatch("closeModal");
    }
</script>


<div class="fixed z-60 h-full w-full flex items-center justify-center">
    <div class="bg-primary-800 w-4/6 shadow-lg rounded-lg p-4">
        <p class="text-center text-primary-200">Review Submitted!</p>
        <p class="text-primary-200 border-b border-primary-700 mb-4 py-12 px-4">Your review has been submitted, we thank you for your input!</p>
        <div class="flex justify-center">
            <button on:click={closeModal} class="text-primary-200 px-4 py-2 bg-primary-700 rounded-lg hover:bg-primary-600">Close</button>
        </div>
    </div>
</div>