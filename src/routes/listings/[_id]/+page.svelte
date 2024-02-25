<script lang="ts">
    import Navigation from '../../navigation/+page.svelte'
    import Authorization from '../../auth/+page.svelte'
    import { page } from '$app/stores'

    export let data: any

    $: console.log(data?.body)

    // helps us limit and show all amenities
    let showCount = 5
    function showAll() {
        showCount = data?.body?.amenities.length
    }

    let open = false
    let review = false
    function openReviews() {
        open = true
    }

    function makeReview() {
        review = true
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
                    <div class="shadow-sm">
                        <div class="flex justify-between items-center p-4 bg-primary-800 shadow-md">
                            {#if !review}
                                <h2 class="text-2xl text-primary-200">{data?.body?.reviews.length} Reviews</h2>
                            {:else}
                                <h2 class="text-2xl text-primary-200">Add Review</h2>
                            {/if}
                            <button class="fa-solid fa-circle-xmark text-primary-200 bg-primary-700 rounded-lg hover:bg-primary-600 hover:text-primary-200" 
                            on:click={() => {
                                open = false
                                review = false
                            }}></button>
                        </div>
                        {#if !review}
                            <!-- text button to open the 'review form' -->
                            <div class="flex justify-center items-center p-1 bg-primary-700 mb-4 ">
                                {#if data?.body?.reviews.length === 0}
                                    <button on:click={makeReview} class="text-primary-200 hover:text-primary-400">There's no reviews yet, want to make a review?</button>
                                {:else}
                                    <button on:click={makeReview} class="text-primary-200 hover:text-primary-400">Want to add your own review?</button>
                                {/if}
                            </div>
                        {/if}
                    </div>

                    <!-- all the database reviews -->
                    {#if !review}
                        <div class="flex flex-col px-4">
                            {#each data?.body?.reviews as review}
                                <div class=" border border-b-primary-800 border-t-0 border-l-0 border-r-0 pb-4 mb-4">
                                    <div class="">
                                        <h2 class="text-primary-600">{review.reviewer_name}</h2>
                                        <!-- <h2 class="text-primary-200">{review.date}</h2> -->
                                    </div>
                                    <p class="text-primary-200 font-light">{review.comments}</p>
                                </div>
                            {/each}
                        </div>

                        <!-- when review is true it adds the review form -->
                        {:else if review}
                            <form class="w-full h-full flex justify-center items-center" method="POST">
                                <div class="w-full">
                                    <div class="p-4">
                                        <input class="w-full my-4 rounded-lg bg-primary-800 border border-primary-700 placeholder-primary-900" id="username" type="text" placeholder="Your Name..." required />
                                        <textarea class="w-full my-4 rounded-lg bg-primary-800 border border-primary-700 placeholder-primary-900" id="username" placeholder="Your review..." required />
                                        <div class="flex justify-center">
                                            <button class="py-2 px-4 bg-primary-700 rounded-lg hover:bg-primary-600 hover:text-primary-200 mx-4">Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
    <!-- end of review modal -->

    <main class="">

        <Navigation />

        <div class="lg:flex lg:flex-wrap">
            <!-- title -->
            <h1 class="lg:basis-full hidden lg:block text-2xl m-4">{data?.body?.name}</h1>

            <!-- image -->
            <div class="lg:basis-6/12">
                <div class="flex h-full justify-center items-center lg:px-4">
                    <img src={data?.body?.image} alt="AirBnB Room" class=" lg:rounded-lg shadow-lg "/>
                </div>
            </div>

            <div class="lg:basis-6/12">
                <!-- title on large -->
                <h1 class="text-2xl m-4 lg:hidden">{data?.body?.name}</h1>

                <!-- type of room listing -->
                <h2 class="text-lg mx-4 mb-1">{data?.body?.room_type} in {data?.body?.address.suburb}, {data?.body?.address.market}</h2>

                <!-- capacities -->
                <div class="mx-4 mb-1 flex gap-2 text-primary-600">
                    <p>{data?.body?.guests_included > 1 ? data?.body?.guests_included + ' Guests' : data?.body?.guests_included + ' Guest'}</p>
                    <p>&bull;</p>
                    <p>{data?.body?.bedrooms > 1 ? data?.body?.bedrooms + ' Bedrooms' : data?.body?.bedrooms + ' Bedroom'}</p>
                    <p>&bull;</p>
                    <p>{data?.body?.beds > 1 ? data?.body?.beds + ' Beds' : data?.body?.beds + ' Bed'}</p>
                    <p>&bull;</p>
                    <p>{data?.body?.bathrooms > 1 ? data?.body?.bathrooms + ' Baths' : data?.body?.bathrooms + ' Bath'}</p>
                </div>

                <!-- rating -->
                <div class="mx-4 flex gap-2 items-center">
                    <i class="fa-solid fa-star"></i>
                    <h2 class="">{data?.body?.review_scores.review_scores_rating === undefined ? "No Rating" : data?.body?.review_scores.review_scores_rating}</h2>
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
                                <p class="text-primary-600">Superhost</p>
                                <p class="text-primary-600">&bull;</p>
                            {/if}
                            <p class="text-primary-600">{data?.body?.host.host_total_listings_count > 1 ? data?.body?.host.host_total_listings_count + 'years hosting' : data?.body?.host.host_total_listings_count + ' year hosting'}</p>
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
                            <p class="text-primary-600">{amenity}</p>
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

                <!-- button and pricing bar on large -->
                <div class="w-full mb-4">
                    <div class="hidden lg:flex bg-primary-900 py-4 justify-between shadow-lg items-center mx-4 rounded-lg">
                        <p class="mx-4"><a class=" text-lg">${data?.body?.price}.00</a> night</p>
            
                        <button class="py-2 px-4 bg-primary-700 rounded-lg hover:bg-primary-600 hover:text-primary-200 mx-4" 
                        on:click={() => alert("Thanks for the reservation. Unfortunately right now we don't have the hookups to make this request")}
                        >Reserve</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- button and pricing bar on small and medium -->
        <div>
            <div class="lg:hidden bg-primary-900 py-4 flex justify-between fixed bottom-0 w-full shadow-lg items-center">
                <p class="mx-4"><a class=" text-lg">${data?.body?.price}.00</a> night</p>

                <button class="py-2 px-4 bg-primary-700 rounded-lg hover:bg-primary-600 hover:text-primary-200 mx-4" 
                on:click={() => alert("Thanks for the reservation. Unfortunately right now we don't have the hookups to make this request")}
                >Reserve</button>
            </div>
        </div>
    </main>
{:else}
    <Authorization />
{/if}



