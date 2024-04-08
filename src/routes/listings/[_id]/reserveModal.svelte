<script>
    import { createEventDispatcher } from "svelte";
    let dispatch = createEventDispatcher();

    function closeModal() {
        dispatch("closeReservationModal");
    }
</script>


<div class="fixed z-80 h-full w-full flex items-center justify-center">
    <div class="bg-primary-800 border border-primary-700 w-4/6 lg:w-3/6 shadow-lg rounded-lg p-4">
        <p class="text-center text-primary-200">Reservation Placed</p>
        <p class="text-primary-200 border-b border-primary-700 mb-4 py-12 px-4 text-center">Awesome! Your reservation has been placed! Just an FYI this is what the price would normally cost but as of today, all reservations are FREE!!!!!! Your reservation can be viewed in your Reservations section of your profile.</p>
        <div class="flex justify-center">
            <button on:click={closeModal} class="text-primary-200 px-4 py-2 bg-primary-700 rounded-lg hover:bg-primary-600">Close</button>
        </div>
    </div>
</div>