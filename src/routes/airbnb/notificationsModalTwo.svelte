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

<div class="fixed z-30 h-full w-full flex items-center justify-center">
    <div class="bg-primary-600 border border-primary-500 w-4/6 lg:w-3/6 h-auto shadow-lg rounded-lg flex gap-4 p-4 bg-opacity-80 backdrop-blur-sm">
        <div class="h-auto border-r border-primary-700 flex items-center pr-4 flex items-center">
            <i class="fa-solid fa-triangle-exclamation text-2xl"></i>
        </div>

        <div>
            <h1 class="text-primary-900 font-bold">{$notificationsTitle}</h1>
            <p class="text-primary-200 mb-6 font-light">{$notificationsMessage}</p>
            <div class="flex justify-start gap-4">
                <button on:click={initiateResponse} class="text-primary-200 px-4 py-1 bg-primary-900 rounded-lg hover:rounded-2xl transition-all duration-300">Submit</button>
                <button on:click={closeModal} class="text-primary-200 px-4 py-1 bg-primary-700 rounded-lg hover:rounded-2xl hover:bg-primary-900 transition-all duration-300">Cancel</button>
            </div>
        </div>
    </div>
</div>