<script lang="ts">
    import Navigation from '../navigation/+page.svelte'
    import Authorization from '../auth/+page.svelte'
    import { page } from '$app/stores'

    export let data: any

    // $: console.log(data.body)

    let hoveredId = null
</script>

{#if $page.data.session?.user}
    <main class="">
        <Navigation />
        
        <div class="mx-4 my-12">
            <h1 class="text-xl border border-b-primary-800 border-t-0 border-l-0 border-r-0 pb-2"><a class="text-primary-500">{data.body.length}</a> Listings Available</h1>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mx-4 mb-4">
            {#each data.body as listing}

                <!-- the mouseenter and mouseleave assign the id of each hover to the hoverId -->
                <div class="flex items-center">

                    <div class="relative z-0 m-1 border border-primary-800 rounded-lg transition-all duration-300 ease-in-out shadow-lg bg-primary-900" 
                    role="banner"
                    on:mouseenter={() => {
                        hoveredId = listing._id
                        // console.log(hoveredId)
                    }}
                    on:mouseleave={() => hoveredId = null}
                    >

                        <div class=" ">
                            <!-- list image -->
                            <div class="flex justify-center mb-4">
                                <img src={listing.image} alt="{listing.image}" class="rounded-t-lg {hoveredId === listing._id ? 'blur-sm' : 'blur-0'}"/>
                            </div>

                            <!-- listing name -->
                            <div class="px-2 py-1">
                                <h2 class="">{listing.name}</h2> 
                            </div>

                            <!-- short description -->
                            <div class="px-2 py-1 text-primary-600">
                                <!-- uses substring to give us a new string with a limit of 50 characters and if theres less, then the whole thing gets displayed  also if there is no description we set the default -->
                                <p class="">{listing.neighborhood_overview.length > 50 ? listing.neighborhood_overview.substring(0, 50) + '...' : listing.neighborhood_overview < 1 ? "No Description Listed" : listing.neighborhood_overview}</p> 
                            </div>

                            <!-- number of beds -->
                            <div class="px-2 py-1 text-primary-600">
                                <p class="">{listing.beds > 1 ? listing.beds + ' Beds' : listing.beds + ' Bed'}</p> 
                            </div>

                            <!-- price and rating -->
                            <div class="px-2 py-1 mb-4 flex justify-between">
                                <h2 class="">$ {listing.price}.00 night</h2>

                                <div class="flex gap-2 items-center">
                                    <i class="fa-solid fa-star"></i>
                                    <h2 class="">{listing.review_scores.review_scores_rating === undefined ? "No Rating" : listing.review_scores.review_scores_rating}</h2>
                                </div>
                            </div>
                        </div>

                        <!-- displays the link above each card -->
                        <a href={`/listings/${listing._id}`} class="absolute z-10 {hoveredId === listing._id ? 'h-5/6' : 'h-0'} w-full bg-primary-500 bottom-0 flex items-center justify-center transition-all duration-300 ease-in-out rounded-lg"
                        >
                            <p class="{hoveredId === listing._id ? 'block' : 'hidden'} text-primary-900 text-4xl"><i class="fa-solid fa-house"></i>  View Listing</p>
                        </a>
                    </div>

                </div>

            {/each}

        </div>

    </main>
{:else}
    <Authorization />
{/if}