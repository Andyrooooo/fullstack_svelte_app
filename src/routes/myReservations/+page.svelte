<script lang="ts">
	import Authorization from '../auth/+page.svelte'
	import Navigation from '../navigation/+page.svelte'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
    import { grabReservations } from '../grabReservations/grabReservations'
    import { reservations, notificationsModalTwo, notificationsTitle, notificationsMessage } from '../airbnb/airbnbStore'
    import NotificationsModalTwo from '../airbnb/notificationsModalTwo.svelte'

    // the onmount will grab the email and then grab the specific reservations the user has made 
    onMount(() => {
       let userEmail = $page?.data?.session?.user?.email
        grabReservations(userEmail)
    })

    // reactive statement to get the number of reservations
    let numberOfReservations = $reservations
    $: numberOfReservations = $reservations
    let hovered = []
    let rightName = []
    let newName
    let newNameObject
    let visible = []

    // formats the date to a more readable format
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('default', { month: 'short' });
    }

    // deletes a reservation from the list and the database
    function deleteReservation(reservationId: any, index: number) {
        notificationsTitle.set("Deleting your Reservation")
        notificationsMessage.set("Are you sure you want to delete this reservation?")
        notificationsModalTwo.set(true)
        newNameObject = {
            _id: reservationId,
            index: index,
            type: "delete"
        }
    }

    // pops up a modal to confirm the name change and sends it to the name object for it to be sent to the database
    function sendNewName(reservationId: any, index: number) {
        notificationsTitle.set("Renaming your Reservation")
        notificationsMessage.set("Are you sure you want to delete this reservation?")
        notificationsModalTwo.set(true)
        newNameObject = {
            userName: newName,
            _id: reservationId,
            index: index,
            type: "nameChange"
        }
    }

    // initiate response function comes from the modal, when they select "submit" it will make a request to delete or change the name
    async function initiateResponse() {
        if (newNameObject.type === "delete") {
            const response = await fetch('../api/deleteReservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ _id: newNameObject._id })
            })
            $reservations = $reservations.filter(reservation => reservation._id !== newNameObject._id)
        } 
        else if (newNameObject.type === "nameChange") {
            const response = fetch('../api/sendNameToReservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newNameObject)
            })
            const findReservation = $reservations.find(reservation => reservation._id === newNameObject._id)
            let StoreNameChange = findReservation.userName = newNameObject.userName

            rightName[newNameObject.index] = false
            newName = ""
        }
    }

</script>

<!-- {#if $page.data.session?.user} -->
    {#if $notificationsModalTwo}
        <NotificationsModalTwo on:response={initiateResponse}/>
    {/if}

	<div class="h-full mb-4">
		<div class="h-1/6">
			<Navigation />
		</div>

		<div class="h-5/6 w-full">

            {#if $reservations.length < 1}
                <div class="flex justify-center mt-72 px-4">
                    <div>
                        <p class="text-3xl font-bold pr-4 pb-4 text-center">You have no reservations</p>
                        <i class="fa-solid fa-face-sad-tear text-5xl block text-center"></i>
                    </div>
                </div>
            {:else}
                <h1 class="text-2xl font-bold px-4 mt-8 mb-8">{numberOfReservations.length > 1 ? `You have ${numberOfReservations.length} reservations ` : `You have ${numberOfReservations.length} reservation `}</h1>
            {/if}

			<div class="md:flex md:flex-wrap lg:block">
                {#each numberOfReservations as reservation, index (reservation)}
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <!-- svelte-ignore a11y-mouse-events-have-key-events -->

                <!-- menu for mobile and tablet -->
                <div class="sm:px-4 sm:py-2 basis-6/12 lg:hidden md:p-4">
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                    <div class=" border border-primary-600 rounded-lg shadow-lg bg-primary-700" on:mouseover={() => hovered[index] = true} on:mouseleave={() => hovered[index] = false}>
                        <!-- svelte-ignore a11y-img-redundant-alt -->
                        
                        <!-- When hovered over it will show a label that lets you view the listing -->
                        <a on:mouseenter={() => visible[index] = true} on:mouseleave={() => visible[index] = false} href={`/listings/${reservation?.listingId}`} class="relative flex">
                            <img src={reservation?.listingImage} alt="Airbnb listing picture" class="object-cover rounded-t-lg w-full">
                            <div class="absolute z-20 h-full w-full flex justify-center items-center {visible[index] ? "block" : "hidden"}">
                                <p class="text-primary-50 bg-primary-700 rounded-lg hover:rounded-xl transition-all duration-300 px-6 py-4">View Listing</p>
                            </div>
                        </a>
                        
                        <div class="p-4 relative w-full">
                            <!-- <a href={`/listings/${reservation?.listingId}`} class="basis-8/12 py-4"> -->
                            <!-- svelte-ignore a11y-missing-attribute -->
                            <a class="py-4 flex justify-start">
                                <div>
                                    <p class="font-bold text-lg mb-4 text-primary-50">{reservation?.listingName}</p>
                                    <div class="text-sm">
                                        {#if rightName[index]}
                                            <div class="flex items-center text-primary-400 ">
                                                <i class="fa-solid fa-signature mr-4"></i>
                                                <input class="focus bg-inherit border-none focus:outline-none focus:ring-0 py-0 px-0 text-sm" placeholder={reservation?.userName} bind:value={newName} />
                                            </div>
                                        {:else}
                                            <div class="flex items-center text-primary-400 ">
                                                <i class="fa-solid fa-signature mr-4"></i>
                                                <p class="text-primary-200">{reservation?.userName}</p>
                                            </div>
                                        {/if}
                                        <div class="flex items-center text-primary-400 ">
                                            <i class="fa-solid fa-earth-americas mr-4"></i>
                                            <p class="text-primary-200">{reservation?.location}</p>
                                        </div>
                                        <div class="flex items-center text-primary-400 ">
                                            <i class="fa-solid fa-bed mr-4"></i>
                                            <p class="text-primary-200">{reservation?.numberOfNights}</p>
                                        </div>
                                        <div class="flex items-center text-primary-400 ">
                                            <i class="fa-solid fa-calendar mr-4"></i>
                                            <p class=" mx-1">From</p>
                                            <p class="text-primary-200">{formatDate(reservation?.startDate).substring(0,3)} {(reservation?.startDate).substring(8,10)}</p>
                                            <p class=" mx-1">to</p>
                                            <p class="text-primary-200">{formatDate(reservation?.endDate).substring(0,3)} {(reservation?.endDate).substring(8,10)}</p>
                                        </div>
                                        <div class="flex items-center text-primary-400 ">
                                            <i class="fa-solid fa-sack-dollar mr-4"></i>
                                            <p class=" text-primary-200">${reservation?.payPrice}</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            
                            <div  class="flex justify-end absolute z-10 bottom-0 right-0 h-full w-6/12 text-primary-200 ">
                                {#if rightName[index]}
                                    <button on:click={() => sendNewName(reservation?._id, index)} class="rounded-bl-lg bg-green-500 h-0 transition-all duration-300 {hovered[index] ? 'h-3/6' : 'h-0'} w-full">
                                        <i class="fa-solid fa-paper-plane text-xl {hovered[index] ? 'block' : 'hidden'}"></i>
                                    </button>
    
                                    <button on:click={() => {
                                        rightName[index] = false
                                        newName = ""
                                        }} class="bg-red-500 h-0 transition-all duration-300 {hovered[index] ? 'h-3/6' : 'h-0'} w-full">
                                        <i class="fa-solid fa-ban text-xl {hovered[index] ? 'block' : 'hidden'}"></i>
                                    </button>
                                    
                                {:else}
                                    <button on:click={() => rightName[index] = !rightName[index]} class="rounded-bl-lg bg-yellow-500 h-0 transition-all duration-300 {hovered[index] ? 'h-3/6' : 'h-0'} w-full">
                                        <i class="fa-solid fa-pen-to-square text-xl {hovered[index] ? 'block' : 'hidden'}"></i>
                                    </button>
    
                                    <button on:click={() => deleteReservation(reservation?._id, index)} class="bg-red-500 transition-all duration-300 h-0 {hovered[index] ? 'h-3/6' : 'h-0'} w-full">
                                        <i class="fa-solid fa-trash text-xl {hovered[index] ? 'block' : 'hidden'}"></i>
                                    </button>
                                {/if}
                                
                            </div>
                        </div>
                    </div>
                </div>

                <!-- reservations on large screens -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                <!-- when hovered it will show options to delete, edit, cancel, and send updates to the name-->
                <div class="hidden lg:flex border border-primary-600 m-4 rounded-lg shadow-lg bg-primary-700 gap-4 max-h-52" on:mouseover={() => hovered[index] = true} on:mouseleave={() => hovered[index] = false}>
                    <!-- svelte-ignore a11y-img-redundant-alt -->
                    
                    <!-- When hovered over it will show a label that lets you view the listing -->
                    <a on:mouseenter={() => visible[index] = true} on:mouseleave={() => visible[index] = false} href={`/listings/${reservation?.listingId}`} class="relative flex basis-3/12">
                        <img src={reservation?.listingImage} alt="Airbnb listing picture" class="object-cover rounded-l-lg">
                        <div class="absolute z-20 h-full w-full flex justify-center items-center {visible[index] ? "block" : "hidden"}">
                            <p class="text-primary-50 bg-primary-700 rounded-lg px-6 py-4">View Listing</p>
                        </div>
                    </a>
                    
                    <div class="flex w-full">
                        <!-- <a href={`/listings/${reservation?.listingId}`} class="basis-8/12 py-4"> -->
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <a class="basis-8/12 py-4 flex justify-start">
                            <div>
                                <p class="font-bold text-lg mb-4 text-primary-50">{reservation?.listingName}</p>
                                <div class="text-sm">
                                    {#if rightName[index]}
                                        <div class="flex items-center text-primary-400">
                                            <i class="fa-solid fa-signature mr-4"></i>
                                            <input class="text-primary-400 focus bg-inherit border-none focus:outline-none focus:ring-0 py-0 px-0 text-sm" placeholder={reservation?.userName} bind:value={newName} />
                                        </div>
                                    {:else}
                                        <div class="flex items-center text-primary-400">
                                            <i class="fa-solid fa-signature mr-4"></i>
                                            <p class="text-primary-200">{reservation?.userName}</p>
                                        </div>
                                    {/if}
                                    <div class="flex items-center text-primary-400">
                                        <i class="fa-solid fa-earth-americas mr-4"></i>
                                        <p class="text-primary-200">{reservation?.location}</p>
                                    </div>
                                    <div class="flex items-center text-primary-400">
                                        <i class="fa-solid fa-bed mr-4"></i>
                                        <p class="text-primary-200">{reservation?.numberOfNights}</p>
                                    </div>
                                    <div class="flex items-center text-primary-400">
                                        <i class="fa-solid fa-calendar mr-4"></i>
                                        <p class="text-primary-400 mx-1">From</p>
                                        <p class="text-primary-200">{formatDate(reservation?.startDate).substring(0,3)} {(reservation?.startDate).substring(8,10)}</p>
                                        <p class="text-primary-400 mx-1">to</p>
                                        <p class="text-primary-200">{formatDate(reservation?.endDate).substring(0,3)} {(reservation?.endDate).substring(8,10)}</p>
                                    </div>
                                    <div class="flex items-center text-primary-400">
                                        <i class="fa-solid fa-sack-dollar mr-4"></i>
                                        <p class="text-primary-200">${reservation?.payPrice}</p>
                                    </div>
                                </div>
                            </div>
                        </a>
                        
                        <div  class="basis-4/12 rounded-r-lg flex pl-2 text-primary-200">
                            {#if rightName[index]}
                                <button on:click={() => sendNewName(reservation?._id, index)} class="bg-green-500 h-full transition-all duration-100 w-0 flex items-center justify-center {hovered[index] ? 'w-6/12' : 'w-0'}">
                                    <i class="fa-solid fa-paper-plane text-xl {hovered[index] ? 'block' : 'hidden'}"></i>
                                </button>

                                <button on:click={() => {
                                    rightName[index] = false
                                    newName = ""
                                    }} class="bg-red-500 h-full transition-all duration-300 w-0 rounded-r-lg flex items-center justify-center {hovered[index] ? 'w-6/12' : 'w-0'}">
                                    <i class="fa-solid fa-ban text-xl {hovered[index] ? 'block' : 'hidden'}"></i>
                                </button>
                                
                            {:else}
                                <button on:click={() => rightName[index] = !rightName[index]} class="bg-yellow-500 h-full transition-all duration-100 w-0 flex items-center justify-center {hovered[index] ? 'w-6/12' : 'w-0'}">
                                    <i class="fa-solid fa-pen-to-square text-xl {hovered[index] ? 'block' : 'hidden'}"></i>
                                </button>

                                <button on:click={() => deleteReservation(reservation?._id, index)} class="bg-red-500 h-full transition-all duration-300 w-0 rounded-r-lg flex items-center justify-center {hovered[index] ? 'w-6/12' : 'w-0'}">
                                    <i class="fa-solid fa-trash text-xl {hovered[index] ? 'block' : 'hidden'}"></i>
                                </button>
                            {/if}
                            
                        </div>
                    </div>
                </div>
                
                {/each}
            </div> <!-- container to add flex styling on medium screens -->

		</div>
	</div>
<!-- 
{/if} -->