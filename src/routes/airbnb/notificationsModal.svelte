<script>
    import { notificationsModal, notificationsTitle, notificationsMessage, notificationsWarning, notificationsReservations, notificationsReviews } from "./airbnbStore";

    function closeModal() {
        notificationsModal.set(false)
        notificationsMessage.set('')
        notificationsTitle.set('')
        notificationsWarning.set(false)
        notificationsReservations.set(false)
        notificationsReviews.set(false)
        
    }
</script>

<div class="fixed z-90 h-full w-full flex items-center justify-center">
    <div class="bg-primary-600 border border-primary-500 w-4/6 lg:w-3/6 h-auto shadow-lg rounded-lg flex gap-4 p-4 bg-opacity-80 backdrop-blur-sm">
        <div class="h-auto border-r border-primary-700 flex items-center pr-4 flex items-center">
            {#if $notificationsWarning}
                <i class="fa-solid fa-triangle-exclamation text-2xl"></i>
            {:else if $notificationsReservations}
                <i class="fa-solid fa-check text-2xl"></i>
            {:else if  $notificationsReviews}
                <i class="fa-solid fa-pencil text-2xl"></i>
            {/if}
        </div>

        <div>
            <h1 class="text-primary-900 font-bold">{$notificationsTitle}</h1>
            <p class="text-primary-200 mb-6 font-light">{$notificationsMessage}</p>
            <div class="flex justify-start">
                <button on:click={closeModal} class="text-primary-200 px-4 py-1 bg-primary-900 rounded-lg hover:rounded-2xl transition-all duration-300">Close</button>
            </div>
        </div>
    </div>
</div>