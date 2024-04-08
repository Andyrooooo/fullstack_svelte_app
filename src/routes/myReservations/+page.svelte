<script lang="ts">
	import Authorization from '../auth/+page.svelte'
	import Navigation from '../navigation/+page.svelte'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
    import { grabReservations } from '../grabReservations/grabReservations'
    import { reservations, notificationsModalTwo, notificationsTitle, notificationsMessage } from '../airbnb/airbnbStore'
    import NotificationsModalTwo from '../airbnb/notificationsModalTwo.svelte'

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

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('default', { month: 'short' });
    }

    function deleteReservation(reservationId: any) {
        const response = fetch('../myReservations/deleteReservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: reservationId })
        })
        $reservations = $reservations.filter(reservation => reservation._id !== reservationId)

    }

    function sendNewName(reservationId: any, index: number) {
        notificationsTitle.set("Renaming your Reservation")
        notificationsMessage.set("Are you sure you want to delete this reservation?")
        notificationsModalTwo.set(true)
        newNameObject = {
            userName: newName,
            _id: reservationId,
            index: index
        }
    }

    async function initiateResponse() {
        const response = fetch('../myReservations/sendNameToReservation', {
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

</script>

{#if $page.data.session?.user}
	<div class="h-full mb-4">
		<div class="h-1/6">
			<Navigation />
		</div>

		<div class="h-5/6">
            {#if $notificationsModalTwo}
                <NotificationsModalTwo on:response={initiateResponse}/>
            {/if}

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
			{#each numberOfReservations as reservation, index (reservation)}
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                <div class="flex border border-primary-800 m-4 rounded-lg shadow-lg bg-primary-900 gap-4" on:mouseover={() => hovered[index] = true} on:mouseleave={() => hovered[index] = false}>
                    <!-- svelte-ignore a11y-img-redundant-alt -->
                    <a href={`/listings/${reservation?.listingId}`} class="basis-4/12 flex hover:blur-sm">
                        <img src={reservation?.listingImage} alt="Airbnb listing picture" class="object-cover rounded-l-lg">
                    </a>
                    <div class="flex w-full basis-8/12">
                        <!-- <a href={`/listings/${reservation?.listingId}`} class="basis-8/12 py-4"> -->
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <a class="basis-8/12 py-4">
                            <p class="font-bold text-lg mb-4">{reservation?.listingName}</p>
                            <div class="text-sm">
                                {#if rightName[index]}
                                    <div class="flex items-center">
                                        <i class="fa-solid fa-signature mr-4"></i>
                                        <input class="text-primary-400 focus bg-inherit border-none focus:outline-none focus:ring-0 py-0 px-0 text-sm" placeholder={reservation?.userName} bind:value={newName} />
                                    </div>
                                {:else}
                                    <div class="flex items-center">
                                        <i class="fa-solid fa-signature mr-4"></i>
                                        <p class="text-primary-400">{reservation?.userName}</p>
                                    </div>
                                {/if}
                                <div class="flex items-center">
                                    <i class="fa-solid fa-earth-americas mr-4"></i>
                                    <p class="text-primary-400">{reservation?.location}</p>
                                </div>
                                <div class="flex items-center">
                                    <i class="fa-solid fa-bed mr-4"></i>
                                    <p class="text-primary-400">{reservation?.numberOfNights}</p>
                                </div>
                                <div class="flex items-center">
                                    <i class="fa-solid fa-calendar mr-4"></i>
                                    <p class="text-primary-400 mx-1">From</p>
                                    <p class="text-primary-400">{formatDate(reservation?.startDate).substring(0,3)} {(reservation?.startDate).substring(8,10)}</p>
                                    <p class="text-primary-400 mx-1">to</p>
                                    <p class="text-primary-400">{formatDate(reservation?.endDate).substring(0,3)} {(reservation?.endDate).substring(8,10)}</p>
                                </div>
                                <div class="flex items-center">
                                    <i class="fa-solid fa-sack-dollar mr-4"></i>
                                    <p class="text-primary-400">${reservation?.payPrice}</p>
                                </div>
                            </div>
                        </a>
                        
                        <div  class="basis-4/12 rounded-r-lg flex pl-2">
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

                                <button on:click={() => deleteReservation(reservation?._id)} class="bg-red-500 h-full transition-all duration-300 w-0 rounded-r-lg flex items-center justify-center {hovered[index] ? 'w-6/12' : 'w-0'}">
                                    <i class="fa-solid fa-trash text-xl {hovered[index] ? 'block' : 'hidden'}"></i>
                                </button>
                            {/if}
                            
                        </div>
                    </div>
                </div>
            {/each}
		</div>
	</div>
{:else}
	<Authorization />
{/if}