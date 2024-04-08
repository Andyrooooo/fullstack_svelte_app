<script>
    import { notificationsModalTwo, notificationsTitle, notificationsMessage } from "./airbnbStore";
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    function closeModal() {
        notificationsModalTwo.set(false)
    }

    function initiateResponse() {
        dispatch('response')
        notificationsModalTwo.set(false)
    }
</script>


<div class="fixed z-90 h-full w-full flex items-center justify-center">
    <div class="bg-primary-800 border border-primary-700 w-4/6 lg:w-3/6 shadow-lg rounded-lg p-4">
        <p class="text-center text-primary-200">{$notificationsTitle}</p>
        <p class="text-primary-200 border-b border-primary-700 mb-4 py-12 px-4 text-center">{$notificationsMessage}</p>
        <div class="flex gap-4 justify-center">
            <button on:click={initiateResponse} class="text-primary-200 px-4 py-2 bg-primary-700 rounded-lg hover:bg-primary-600">Submit</button>
            <button on:click={closeModal} class="text-primary-200 px-4 py-2 bg-primary-700 rounded-lg hover:bg-primary-600">Cancel</button>
            
        </div>
    </div>
</div>