<script lang="ts">
    import Navigation from '../../navigation/+page.svelte'
    import Authorization from '../../auth/+page.svelte'
    import { page } from '$app/stores'

    export let data: any

    // $: console.log(data?.body?)

    // helps us limit and show all amenities
    let showCount = 5;
    function showAll() {
        showCount = data?.body?.amenities.length;
    }
</script>



{#if $page.data.session?.user}
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
                <div class="mx-4 pb-6 flex gap-2 items-center border border-b-primary-800 border-t-0 border-l-0 border-r-0">
                    <i class="fa-solid fa-star"></i>
                    <h2 class="">{data?.body?.review_scores.review_scores_rating === undefined ? "No Rating" : data?.body?.review_scores.review_scores_rating}</h2>
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



