<script lang="ts">
    import Navigation from '../../navigation/+page.svelte'
    import Authorization from '../../auth/+page.svelte'
    import { page } from '$app/stores'
    import { slide } from 'svelte/transition'
    import Modal from './formModal.svelte'
    import ReservationModal from './reserveModal.svelte'
    import Notifications from '../../airbnb/notificationsModal.svelte'
    import { notificationsMessage, notificationsModal, notificationsTitle, reservations } from '../../airbnb/airbnbStore'
    import { onMount } from 'svelte'

	export async function grabReservations(userEmail: string) {
		try {
        const response = await fetch('../../grabReservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: userEmail})
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json()
        reservations.set(data)

        } catch (error) {
            console.error('Failed to fetch reservations:', error)
        }
	}

    // Grabs the reservations when mounted and sends the users email to get ONLY their reservations
    onMount(() => {
		let userEmail = $page?.data?.session?.user?.email
		grabReservations(userEmail)
	})


    let numberOfNights = 1
    let dates = {
        start: "",
        end: ""
    }
    let reservationHeight = "h-20 transition-all duration-300 ease-in-out"
    let rotateSlideButton = "rotate-0"
    let reservationClicked = false

    let formModal = false
    export let data: any
    export let form: any
    // when we get the response if there is a body and is not undefined then we can open the modal 
    if (form?.body != undefined) {
        formModal = true
    }
    let currentRating = 0
    // $: console.log(form?.body)
    /* $: console.log(data?.body) */

    // helps us limit and show all amenities
    let showCount = 5
    function showAll() {
        showCount = data?.body?.amenities.length
    }

    let open = false
    let review = false
    let reviewBar = "w-[87%] min-[500px]:w-[88%] md:w-[89.7%] lg:w-[90.2%]"
    let round = ""
    function openReviews() {
        open = true
    }

    function makeReview() {
        review = true
        reviewBar = "w-11/12"
        round = "rounded-tr-lg"
    }

    let rating = {
        current: 3,
        max: 6
    }

    /* gives us the amount of icons to highlight based on index */
    function whichIcon(index) {
        rating.current = index
    }

    /* tells us how many stars were clicked using index, to get it to show the correct value in the console we had to add a secondary function increment to a different variable because of mouseover and click*/
    function setRating(index) {
        rating.current = index
        increment()
    }

    function increment() {
        currentRating = rating.current + 1
        rating.current = currentRating - 1
        // console.log(currentRating)
    }

    /* gives us the full or empty star icon */
    function getStarType(index) {
    if (index <= rating.current) {
        return 'full';
    } else {
        return 'empty';
    }
}

function closeTheModal() {
    formModal = false
}

function slideReservationUp() {
    if (reservationHeight === "h-20 transition-all duration-300 ease-in-out") {
        reservationHeight = "h-5/6 rounded-t-lg transition-all duration-300 ease-in-out"
        rotateSlideButton = "rotate-180"
    } else {
        reservationHeight = "h-20 transition-all duration-300 ease-in-out"
        rotateSlideButton = "rotate-0"
    }
}

async function sendReservation() {
    let today = new Date()
    let formattedDate = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')

    let start = new Date(dates.start)
    let end = new Date(dates.end)
    let diffInMs = Math.abs(end - start);
    let diffInDays = String(Math.ceil(diffInMs / (1000 * 60 * 60 * 24)));

    if (dates.start === "" || dates.end === "") {
        notificationsModal.set(true)
        notificationsTitle.set("Whoa where'ya goin partner?")
        notificationsMessage.set("Can't have a reservation without making any selections, please fill out the form in the menu below.")
        
    } else if (dates.start < formattedDate || dates.end < formattedDate) {
        notificationsModal.set(true)
        notificationsTitle.set("Are you a time traveler?")
        notificationsMessage.set("Your reservation can't start in the past, please select a correct date.")
    } else {
        if (diffInDays > numberOfNights) {
            notificationsModal.set(true)
            notificationsTitle.set("Whoa there cowboy!")
            notificationsMessage.set("You can't stay longer than the amount of days you've selected, please select a correct date.")
        } else if (diffInDays < numberOfNights){
            notificationsModal.set(true)
            notificationsTitle.set("Whoa there cowboy!")
            notificationsMessage.set("Are you sure you pay for more nights than you're staying? You have more days selected than what you put in the calendar, get on back there!")
        } else {
            reservationHeight = "h-20 transition-all duration-300 ease-in-out"
            rotateSlideButton = "rotate-0"

            let newReservation = {
                listingId: data?.body?._id,
                userName: $page.data.session?.user?.name,
                userEmail: $page.data.session?.user?.email,
                listingName: data?.body?.name,
                listingImage: data?.body?.image,
                location: data?.body?.address.street,
                numberOfNights: numberOfNights,
                startDate: dates.start,
                endDate: dates.end,
                payPrice: (((((data?.body?.price * numberOfNights) + 60 + (data?.body?.cleaning_fee)) * .10)) + (data?.body.price * numberOfNights) + 60 + (data?.body?.cleaning_fee)).toFixed(2)
            }
            let response = await fetch('./[_id]/makeReservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newReservation)
            })
            let returnedReservation = await response.json()
            dates.start = ""
            dates.end = ""
            numberOfNights = 1
            console.log(returnedReservation)
            if (returnedReservation) {
                reservationClicked = true
                let addReservation = [...$reservations, returnedReservation]
                reservations.set(addReservation)
                console.log($reservations)
            }
        }
    }
}
</script>

<!-- lets us sign out correctly -->
{#if $page.data.session?.user}

    <!-- opens up the reviews modal -->
    <!-- revew opens the review form and close the reviews data -->
    {#if open}
        <div>
            <!-- review container and header with the 'close' button -->
            <div class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                <div class="bg-primary-900 w-11/12 h-5/6 rounded-lg overflow-y-auto">
                    <div class="fixed {reviewBar}">
                        <div class="flex justify-between items-center pl-4 py-4 bg-primary-800 shadow-md rounded-tl-lg {round}">
                            {#if !review}
                                <div class="flex font-bold">
                                    <p class="text-primary-200 mr-1 hidden md:block">{data?.body?.name} -</p>
                                    <p class="text-primary-600 mr-1">{data?.body?.reviews.length}</p>
                                    <p>Reviews</p>
                                </div>
                            {:else}
                                <div class="flex font-bold">
                                    <p class="text-primary-200 mr-1 hidden md:block">{data?.body?.name} -</p>
                                    <p class="text-primary-200">Add a Review</p>
                                </div>
                            {/if}
                            <div class="flex gap-8 items-center mr-4">
                                <!-- when adding a review we have a button to go back to reviews -->
                                {#if review}
                                    <button class="fa-solid fa-arrow-left text-primary-700 bg-primary-200 rounded-lg hover:bg-primary-600 hover:text-primary-200 py-1 px-2 rounded-full" 
                                    on:click={() => {
                                        review = false
                                        reviewBar = "w-[87%] min-[500px]:w-[88%] md:w-[89.7%] lg:w-[90.2%]"
                                        round = ""
                                    }}></button>
                                {/if}
                                <!-- button to exit reviews -->
                                <button class="fa-solid fa-circle-xmark text-primary-200 rounded-lg hover:text-primary-600 text-2xl" 
                                on:click={() => {
                                    open = false
                                    review = false
                                }}></button>
                            </div>
                        </div>
                        {#if !review}
                            <!-- text button to open the 'review form' -->
                            <div class="flex justify-center items-center p-1 bg-primary-700 mb-4">
                                {#if data?.body?.reviews.length === 0}
                                    <div class="flex items-center">
                                        <i class="fa-solid fa-pencil mr-2"></i>
                                        <button on:click={makeReview} class="text-primary-200 hover:text-primary-400">There's no reviews yet, want to make a review?</button>
                                    </div>
                                {:else}
                                    <div class="flex items-center">
                                        <i class="fa-solid fa-pencil mr-2"></i>
                                        <button on:click={makeReview} class="text-primary-200 hover:text-primary-400">Want to add your own review?</button>
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    </div>

                    <!-- all the database reviews -->
                    {#if !review}
                        <div class="lg:flex mt-28">
                            <div class="lg:basis-4/12 flex lg:flex-col px-4">
                                <!-- scores for each listing -->
                                    <div class="flex overflow-x-auto lg:block border border-b-primary-800 border-t-0 border-l-0 border-r-0 pb-4 mb-4 lg:border-0 w-full justify-center">

                                        <!-- Accuracy section -->
                                        <div class="border border-b-0 border-t-0 border-l-0 border-r-primary-800 pr-4 mb-4 lg:flex lg:justify-between lg:items-center lg:gap-2 lg:border-b lg:border-b-primary-800 lg:border-r-0 lg:pb-4 lg:pr-0">
                                            <div class="flex items-center">
                                                <i class="fa-solid fa-circle-check hidden lg:text-xl lg:block pr-4"></i>
                                                <p class="lg:text-xl lg:font-bold">Accuracy</p>
                                            </div>
                                            <p class="text-primary-600 block mb-4 lg:mb-0 lg:text-xl lg:font-bold">{data?.body?.review_scores.review_scores_accuracy}</p>
                                            <i class="fa-solid fa-circle-check block lg:hidden"></i>
                                        </div>

                                        <!-- cleanliness section -->
                                        <div class="border border-b-0 border-t-0 border-l-0 border-r-primary-800 px-4 mb-4 lg:flex lg:justify-between lg:items-center lg:gap-2 lg:border-b lg:border-b-primary-800 lg:border-r-0 lg:pb-4 lg:px-0">
                                            <div class="flex items-center">
                                                <i class="fa-solid fa-hand-sparkles hidden lg:text-xl lg:block pr-4"></i>
                                                <p class="lg:text-xl lg:font-bold">Cleanliness</p>
                                            </div>
                                            <p class="text-primary-600 block mb-4 lg:mb-0 lg:text-xl lg:font-bold">{data?.body?.review_scores.review_scores_cleanliness}</p>
                                            <i class="fa-solid fa-hand-sparkles block lg:hidden"></i>
                                        </div>

                                        <!-- checkin section -->
                                        <div class="border border-b-0 border-t-0 border-l-0 border-r-primary-800 px-4 mb-4 lg:flex lg:justify-between lg:items-center lg:gap-2 lg:border-b lg:border-b-primary-800 lg:border-r-0 lg:pb-4 lg:px-0">
                                            <div class="flex items-center">
                                                <i class="fa-solid fa-bell-concierge hidden lg:text-xl lg:block pr-4"></i>
                                                <p class="lg:text-xl lg:font-bold">Checkin</p>
                                            </div>
                                            <p class="text-primary-600 block mb-4 lg:mb-0 lg:text-xl lg:font-bold">{data?.body?.review_scores.review_scores_checkin}</p>
                                            <i class="fa-solid fa-bell-concierge block lg:hidden"></i>
                                        </div>

                                        <!-- communication section -->
                                        <div class="border border-b-0 border-t-0 border-l-0 border-r-primary-800 px-4 mb-4 lg:flex lg:justify-between lg:items-center lg:gap-2 lg:border-b lg:border-b-primary-800 lg:border-r-0 lg:pb-4 lg:px-0">
                                            <div class="flex items-center">
                                                <i class="fa-solid fa-message hidden lg:text-xl lg:block pr-4"></i>
                                                <p class="lg:text-xl lg:font-bold">Communication</p>
                                            </div>
                                            <p class="text-primary-600 block mb-4 lg:mb-0 lg:text-xl lg:font-bold">{data?.body?.review_scores.review_scores_communication}</p>
                                            <i class="fa-solid fa-message block lg:hidden"></i>
                                        </div>

                                        <!-- location section -->
                                        <div class="border border-b-0 border-t-0 border-l-0 border-r-primary-800 px-4 mb-4 lg:flex lg:justify-between lg:items-center lg:gap-2 lg:border-b lg:border-b-primary-800 lg:border-r-0 lg:pb-4 lg:px-0">
                                            <div class="flex items-center">
                                                <i class="fa-solid fa-earth-asia hidden lg:text-xl lg:block pr-4"></i>
                                                <p class="lg:text-xl lg:font-bold">Location</p>
                                            </div>
                                            <p class="text-primary-600 block mb-4 lg:mb-0 lg:text-xl lg:font-bold">{data?.body?.review_scores.review_scores_location}</p>
                                            <i class="fa-solid fa-earth-asia block lg:hidden"></i>
                                        </div>

                                        <!-- value section -->
                                        <div class="border border-b-0 border-t-0 border-l-0 border-r-primary-800 px-4 mb-4 lg:flex lg:justify-between lg:items-center lg:gap-2 lg:border-b lg:border-b-primary-800 lg:border-r-0 lg:pb-4 lg:px-0">
                                            <div class="flex items-center">
                                                <i class="fa-solid fa-money-bill-wave hidden lg:text-xl lg:block pr-4"></i>
                                                <p class="lg:text-xl lg:font-bold">Value</p>
                                            </div>
                                            <p class="text-primary-600 block mb-4 lg:mb-0 lg:text-xl lg:font-bold">{data?.body?.review_scores.review_scores_value}</p>
                                            <i class="fa-solid fa-money-bill-wave block lg:hidden"></i>
                                        </div>

                                        <!-- rating section -->
                                        <div class="border border-b-0 border-t-0 border-l-0 border-r-primary-800 px-4 mb-4 lg:flex lg:justify-between lg:items-center lg:gap-2 lg:border-b lg:border-b-primary-800 lg:border-r-0 lg:pb-4 lg:px-0">
                                            <div class="flex items-center">
                                                <i class="fa-solid fa-tag hidden lg:text-xl lg:block pr-4"></i>
                                                <p class="lg:text-xl lg:font-bold">Rating</p>
                                            </div>
                                            <p class="text-primary-600 block mb-4 lg:mb-0 lg:text-xl lg:font-bold">{data?.body?.review_scores.review_scores_rating}</p>
                                            <i class="fa-solid fa-tag block lg:hidden"></i>
                                        </div>
                                    </div>
                            </div>

                            <div class="lg:basis-8/12 flex flex-col px-4">
                                {#each data?.body?.reviews as review}
                                    <div class=" border border-b-primary-800 border-t-0 border-l-0 border-r-0 pb-4 mb-4">
                                        <!-- users image that gets displayed with the review -->
                                        <div class="lg:flex lg:gap-4">
                                            <div class="lg:basis-1/12 lg:flex lg:justify-center">
                                                {#if review.userImage}
                                                    <img src={review.userImage} class="rounded-full w-14 h-14" />
                                                {:else if !review.userImage}
                                                    <img src="/default-review.jpg" class="rounded-full w-14 h-14" />
                                                {/if}
                                            </div>

                                            <div class="lg:basis-11/12">
                                                <!-- date that will be displayed with the review -->
                                                <div class="">
                                                    <div class="flex items-center">
                                                        <h2 class="text-primary-600">{review.reviewer_name}</h2>
                                                        {#if review.date}
                                                            <p class="text-primary-300 text-2xs ml-2">&bull;</p>
                                                            <p class="text-primary-300 text-2xs ml-2">{review.date.toString().substring(3,7)}</p>
                                                            <p class="text-primary-300 text-2xs ml-1">{review.date.toString().substring(11,15)}</p>
                                                        {/if}
                                                    </div>
                                                    <!-- <h2 class="text-primary-200">{review.date}</h2> -->
                                                    <!-- stars for new review -->
                                                    {#if review.rating}
                                                        <div class="flex gap-1 my-1">
                                                            {#each Array(review.rating) as _, index (index)}
                                                                <i class="fa-solid fa-star text-primary-200 text-3xs"></i>
                                                            {/each}
                                                        </div>
                                                    {/if}
                                                </div>
                                                <!-- comments for the review -->
                                                <p class="text-primary-200 font-light">{review.comments}</p>
                                            </div>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>

                        <!-- when review is true it adds the review form to sumbit a review -->
                    {:else if review}

                        

                        <form class=" w-full h-full flex justify-center items-center p-4 " method="POST" action="?/submitForm">
                            <div class="w-full">
                                <!-- label and input elements for the users name -->
                                <!-- <div class="flex justify-center">
                                    <div class="w-full md:w-8/12 lg:w-6/12">
                                        <label for="name" class="text-primary-200 mt-4">Your Name</label>
                                        <input name="name"  class="w-full mt-2 rounded-lg bg-primary-800 border border-primary-800 placeholder-primary-500 focus:ring-0 focus:border-primary-500 focus:outline-none" type="text" placeholder="Your Name..." required />
                                    </div>
                                </div> -->

                                <input name="user" id="user" type="hidden" value={$page.data.session?.user?.name}/>
                                <input name="userImage" id="user" type="hidden" value={$page.data.session?.user?.image}/>
                                <input name="rating" id="rating" type="hidden" value={currentRating}/>
                                <input name="listingName" id="listingName" type="hidden" value={data?.body?.name}/>
                                <input name="date" id="date" type="hidden" value={new Date()}/>

                                <!-- Star rating which allows you to hover over the star and also select the star to get the value -->
                                <!-- This is done using mouseenter and grabbing the index and same with the rating when clicked -->
                                <div class="flex justify-center gap-4 mb-8">
                                    {#each Array(rating.max) as _, index (index)}
                                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                                        <div class="star" on:mouseenter={() => whichIcon(index)} on:click={() => setRating(index)} >
                                            {#if getStarType(index) === 'full'}
                                                <i class="fa-solid fa-star text-3xl"></i>
                                            {:else}
                                                <i class="fa-regular fa-star text-3xl"></i>
                                            {/if}
                                        </div>
                                    {/each}
                                </div>


                                <!-- label and textarea elements for the users comment -->
                                <div class="flex justify-center">
                                    <div class="w-full md:w-8/12 lg:w-6/12">
                                        <label for="comment" class="text-primary-200">Comments</label>
                                        <textarea name="comment"  class="w-full h-32 mt-2 rounded-lg bg-primary-800 border border-primary-800 placeholder-primary-500 focus:ring-0 focus:border-primary-500 focus:outline-none" placeholder="Your review..." required />
                                    </div>
                                </div>

                                <!-- submit and cancel button -->
                                <div class="flex justify-center mt-4">
                                    <button class="py-2 px-4 bg-primary-700 rounded-lg hover:bg-primary-600 hover:text-primary-200 mx-4" type="submit">Submit</button>
                                </div>
                            </div>
                        </form>

                        <!-- error message when any data comes back without needed data -->
                        {#if form?.error}
                            <div class="absolute z-10 flex justify-center items center top-36 left-0 w-full">
                                <div class="bg-red-50 w-full md:w-7/12 lg:w-5/12 border-red-400 border rounded-lg mx-10 shadow-lg flex">
                                    <p class="text-red-400 pl-4 py-4 pr-1">Error:</p>
                                    <p class="text-black py-4 pr-4">{form.error}</p>
                                </div>
                            </div>
                        {/if}
                    {/if}
                </div>
            </div>
        </div>
    {/if}
    <!-- end of review modal -->

    <main class="">
        <!-- Modal that will show when the form is submitted and has data and passes all the checks -->  
        {#if formModal}
            <Modal on:closeModal={closeTheModal}/>
        {/if}

        {#if reservationClicked}
            <ReservationModal on:closeReservationModal={() => reservationClicked = false}/>
        {/if}

        {#if $notificationsModal}
            <Notifications />
        {/if}

        <Navigation />

        <div class="lg:flex lg:flex-wrap">
            <!-- title -->
            <h1 class="lg:basis-full hidden lg:block text-2xl m-4">{data?.body?.name}</h1>

            <!-- image -->
            <div class="lg:basis-full mb-4">
                <div class="flex h-full justify-center items-center lg:px-4">
                    <img src={data?.body?.image} alt="AirBnB Room" class="w-full lg:w-6/12 object-cover lg:rounded-l-xl lg:p-1"/>
                    <div class="w-6/12 hidden lg:flex">
                        <div class="">
                            <img src={data?.body?.image} alt="AirBnB Room" class="object-cover p-1"/>
                            <img src={data?.body?.image} alt="AirBnB Room" class="object-cover p-1"/>
                        </div>
                        <div class="">
                            <img src={data?.body?.image} alt="AirBnB Room" class="object-cover rounded-tr-xl p-1"/>
                            <img src={data?.body?.image} alt="AirBnB Room" class="object-cover rounded-br-xl p-1"/>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lg:basis-6/12">
                <!-- title on large -->
                <h1 class="text-2xl m-4 lg:hidden">{data?.body?.name}</h1>

                <!-- type of room listing -->
                <h2 class="text-lg mx-4 mb-1">{data?.body?.room_type} in {data?.body?.address.suburb}, {data?.body?.address.market}</h2>

                <!-- capacities -->
                <div class="mx-4 mb-1 flex gap-2 ">
                    <p><a class="text-primary-600">{data?.body?.guests_included}</a>{data?.body?.guests_included > 1 ? ' Guests' : ' Guest'}</p>
                    <p>&bull;</p>
                    <p><a class="text-primary-600">{data?.body?.bedrooms}</a>{data?.body?.bedrooms > 1 ? ' Bedrooms' : ' Bedroom'}</p>
                    <p>&bull;</p>
                    <p><a class="text-primary-600">{data?.body?.beds}</a>{data?.body?.beds > 1 ? ' Beds' : ' Bed'}</p>
                    <p>&bull;</p>
                    <p><a class="text-primary-600">{data?.body?.bathrooms}</a>{data?.body?.bathrooms > 1 ? ' Baths' : ' Bath'}</p>
                </div>

                <!-- rating -->
                <div class="mx-4 flex gap-2 items-center">
                    <i class="fa-solid fa-star"></i>
                    <h2 class="text-primary-600">{data?.body?.review_scores.review_scores_rating === undefined ? "No Rating" : data?.body?.review_scores.review_scores_rating}</h2>
                </div>

                <!-- {#if Array.isArray(data?.body?.reviews)}
                        {#each data?.body?.reviews as review}
                            <div class="mx-4 pb-6">
                                <p class="text-primary-600">{review.date}</p>
                                <p class="text-primary-600">{review.reviewer_name}</p>
                                <p class="text-primary-600">{review.comments}</p>
                            </div>
                        {/each}
                    {/if} -->

                <div class="mx-4 flex pb-6 border border-b-primary-800 border-t-0 border-l-0 border-r-0">
                    <p class="text-primary-600 pr-2">{data?.body?.reviews.length}</p>
                    <button on:click={openReviews} class="underline hover:text-primary-500">Reviews</button>
                </div>

                <!-- host info -->
                <div class=" border border-b-primary-800 border-t-0 border-l-0 border-r-0 mt-4 pb-4 mx-4 flex">
                    <img src={data?.body?.hostIMG} alt="{data?.body?.host.host_name}" class="rounded-full mr-4 max-w-14" />
                    <div>
                        <p class="text-lg font-bold">{data?.body?.host.host_name}</p>
                        <div class="flex gap-2">
                            {#if data?.body?.host.host_is_superhost}
                                <p>Superhost</p>
                                <p>&bull;</p>
                            {/if}
                            <p><a class="text-primary-600">{data?.body?.host.host_total_listings_count}</a>{data?.body?.host.host_total_listings_count > 1 ? ' years hosting' : ' year hosting'}</p>
                        </div>
                    </div>
                </div>

                <!-- amenities -->
                <div class=" border border-b-primary-800 border-t-0 border-l-0 border-r-0 mx-4 pb-4 mt-4">
                    <h2 class="text-lg mb-2">Amenities</h2>

                    <!-- prevents error from data not available at the time of the fetch -->
                    {#if Array.isArray (data?.body?.amenities)}

                        <!-- limits the amount of visible amenities -->
                        {#each data?.body?.amenities.slice(0, showCount) as amenity}
                            <p transition:slide|global class=" text-primary-600">{amenity}</p>
                        {/each}
                        {#if showCount < data?.body?.amenities.length}
                            <button class="w-full mt-4 py-2 bg-primary-700 rounded-lg hover:bg-primary-600 hover:text-primary-200" on:click={showAll}>Show All</button>
                            {:else}
                            <button class="w-full mt-4 py-2 bg-primary-700 rounded-lg hover:bg-primary-600 hover:text-primary-200" on:click={() => showCount = 5}>Show Less</button>
                        {/if}
                    {/if}
                </div>

                <!-- listing description -->
                <p class="mb-24 text-lg mx-4 mt-4 lg:mb-4">{data?.body?.description}</p>
            </div>

            <!-- button and pricing bar on large -->
            <div class="lg:basis-6/12 mb-4 hidden lg:block w-full">
                <form on:submit|preventDefault={sendReservation} class="hidden lg:block bg-primary-900 py-4 justify-between shadow-lg items-center mx-4 rounded-lg">
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <p class="mx-4"><a class="font-bold text-lg">${data?.body?.price}.00</a> night</p>

                    <div class="mx-4 mt-4 mb-8">
                        <label for="numberOfNights" class="text-primary-200 mb-1">{$page.data.session?.user?.name}, how many nights are you staying?</label>
                        <select name="nights" id="numberOfNights" class="px-4 w-full rounded-lg bg-primary-900 border border-primary-700 focus:border-primary-500 focus:ring-0 text-primary-100" bind:value={numberOfNights} required>
                            <option class="bg-primary-700" value="1">1 night</option>
                            <option class="bg-primary-700" value="2">2 nights</option>
                            <option class="bg-primary-700" value="3">3 nights</option>
                            <option class="bg-primary-700" value="4">4 nights</option>
                            <option class="bg-primary-700" value="5">5 nights</option>
                            <option class="bg-primary-700" value="6">6 nights</option>
                            <option class="bg-primary-700" value="7">7 nights</option>
                        </select>
                    </div>

                    <div class="mx-4 mt-4 mb-8 flex gap-4">
                        <div class="basis-6/12">
                            <label for="dates" class="text-primary-200 mb-1">Check In</label>
                            <input type="date" class="px-4 w-full rounded-lg bg-primary-900 border border-primary-700 focus:border-primary-500 focus:ring-0 text-primary-100" bind:value={dates.start} required/>
                        </div>
                        <div class="basis-6/12">
                            <label for="dates" class="text-primary-200 mb-1">Check Out</label>
                            <input type="date" class="px-4 w-full rounded-lg bg-primary-900 border border-primary-700 focus:border-primary-500 focus:ring-0 text-primary-100" bind:value={dates.end} required/>
                        </div>
                    </div>

                    <div class="mx-4 mb-8">
                        <button class="py-2 w-full bg-primary-700 rounded-lg hover:bg-primary-600 hover:text-primary-200">Reserve</button>
                    </div>

                    <div class="flex justify-between px-4 py-2">
                        <p>${data?.body?.price} x {numberOfNights} {numberOfNights > 1 ? "Nights" : "Night"}</p>
                        <p>${data?.body?.price * numberOfNights}</p>
                    </div>

                    <div class="flex justify-between px-4 py-2">
                        <p>Cleaning Fee</p>
                        <p>${data?.body?.cleaning_fee}</p>
                    </div>

                    <div class="flex justify-between pt-2 px-4">
                        <p>Airbnb Service Fee</p>
                        <p>$60</p>
                    </div>

                    <div class="flex justify-between pt-2 border-b border-primary-800 m-4 mt-2 pb-4">
                        <p>Taxes</p>
                        <p>${(((data?.body?.price * numberOfNights) + 60 + (data?.body?.cleaning_fee)) * .10).toFixed(2)}</p>
                    </div>

                    <div class="flex justify-between px-4 pb-4">
                        <p>Total</p>
                        <p>${(((((data?.body?.price * numberOfNights) + 60 + (data?.body?.cleaning_fee)) * .10)) + (data?.body?.price * numberOfNights) + 60 + (data?.body?.cleaning_fee)).toFixed(2)}</p>
                    </div>
                </form>
            </div>
        </div>

        <!-- button and pricing bar on small and medium -->
        <div>
            <div class="lg:hidden bg-primary-900 fixed bottom-0 w-full shadow-lg items-center p-4 {reservationHeight} transition-all duration-300">
                    {#if $notificationsModal}
                        <Notifications />
                    {/if}

                    <div class="flex justify-center absolute z-10 top-[-1rem] w-full">
                        <button on:click={slideReservationUp} class="fa-solid fa-circle-chevron-up text-3xl hover:translate-y-[-4px] transition-all duration-300 hover:text-primary-500 rounded-full text-primary-700 {rotateSlideButton}"></button>
                    </div>
                    
                    {#if reservationHeight === "h-20 transition-all duration-300 ease-in-out"}
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <form on:submit|preventDefault={sendReservation} class=" flex justify-between items-center h-full">
                            <p class="mx-4"><a class="font-bold text-lg">${data?.body?.price}.00</a> night</p>
        
                            <button class="py-2 px-4 bg-primary-700 rounded-lg hover:bg-primary-600 hover:text-primary-200 mx-4" >Reserve</button>
                        </form>
                    {/if}

                    {#if reservationHeight === "h-5/6 rounded-t-lg transition-all duration-300 ease-in-out"}
                        <form on:submit|preventDefault={sendReservation}>
                            <p class="mx-4"><a class="font-bold text-lg">${data?.body?.price}.00</a> night</p>

                            <div class="mx-4 mt-4 mb-8">
                                <label for="numberOfNights" class="text-primary-200 mb-1">{$page.data.session?.user?.name}, how many nights are you staying?</label>
                                <select name="nights" id="numberOfNights" class="px-4 w-full rounded-lg bg-primary-900 border border-primary-700 focus:border-primary-500 focus:ring-0 text-primary-100" bind:value={numberOfNights} required>
                                    <option class="bg-primary-700" value="1">1 night</option>
                                    <option class="bg-primary-700" value="2">2 nights</option>
                                    <option class="bg-primary-700" value="3">3 nights</option>
                                    <option class="bg-primary-700" value="4">4 nights</option>
                                    <option class="bg-primary-700" value="5">5 nights</option>
                                    <option class="bg-primary-700" value="6">6 nights</option>
                                    <option class="bg-primary-700" value="7">7 nights</option>
                                </select>
                            </div>

                            <div class="mx-4 mt-4 mb-8 flex gap-4">
                                <div class="basis-6/12">
                                    <label for="dates" class="text-primary-200 mb-1">Check In</label>
                                    <input type="date" class="px-4 w-full rounded-lg bg-primary-900 border border-primary-700 focus:border-primary-500 focus:ring-0 text-primary-100" bind:value={dates.start} required/>
                                </div>
                                <div class="basis-6/12">
                                    <label for="dates" class="text-primary-200 mb-1">Check Out</label>
                                    <input type="date" class="px-4 w-full rounded-lg bg-primary-900 border border-primary-700 focus:border-primary-500 focus:ring-0 text-primary-100" bind:value={dates.end} required/>
                                </div>
                            </div>

                            <div class="mx-4 mb-8">
                                <button class="py-2 w-full bg-primary-700 rounded-lg hover:bg-primary-600 hover:text-primary-200" >Reserve</button>
                            </div>

                            <div class="flex justify-between px-4 py-2">
                                <p>${data?.body?.price} x {numberOfNights} {numberOfNights > 1 ? "Nights" : "Night"}</p>
                                <p>${data?.body?.price * numberOfNights}</p>
                            </div>

                            <div class="flex justify-between px-4 py-2">
                                <p>Cleaning Fee</p>
                                <p>${data?.body?.cleaning_fee}</p>
                            </div>

                            <div class="flex justify-between pt-2 px-4">
                                <p>Airbnb Service Fee</p>
                                <p>$60</p>
                            </div>

                            <div class="flex justify-between pt-2 border-b border-primary-800 m-4 mt-2 pb-4">
                                <p>Taxes</p>
                                <p>${(((data?.body?.price * numberOfNights) + 60 + (data?.body?.cleaning_fee)) * .10).toFixed(2)}</p>
                            </div>

                            <div class="flex justify-between px-4 pb-4">
                                <p>Total</p>
                                <p>${(((((data?.body?.price * numberOfNights) + 60 + (data?.body?.cleaning_fee)) * .10)) + (data?.body.price * numberOfNights) + 60 + (data?.body?.cleaning_fee)).toFixed(2)}</p>
                            </div>
                        </form>
                    {/if}
            </div>
        </div>
    </main>
{:else}
    <Authorization />
{/if}
