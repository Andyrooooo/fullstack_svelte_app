<script lang="ts">
	import Authorization from '../auth/+page.svelte'
	import Navigation from '../navigation/+page.svelte'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { grabReservations } from '../grabReservations/grabReservations'

    let areas: any = []
    let areaList: any = []
    let filterOpen = false

	onMount(async () => {
		let userEmail = $page?.data?.session?.user?.email
		await grabReservations(userEmail)

        const response = await fetch('../food/fetchRestaurants')
        areas = await response.json()
	})

    $: areaList = new Set(areas.map(area => area.borough))
    
    function filterBorough(index: any) {
        console.log(index)
    }
</script>

{#if $page.data.session?.user}
	<div class="">
		<div class="">
			<Navigation />
		</div>

		<div class="mx-4 ">
			<h1 class="text-xl my-8">Checkout some great resaurants on your stay!</h1>

            <div class="flex flex-wrap">
                <div class="flex w-full border-b border-primary-800 pb-2 mb-2">

                    <div class="relative basis-11/12">
                        <input type="text" class="rounded-full w-full border border-primary-700 pl-4 pr-12 py-2 bg-primary-800 focus:outline-none focus:ring-0 focus:border-primary-500 placeholder:text-primary-600" placeholder="Search for a restaurant..."/>
                        <button class="absolute z-10 right-[1px] h-full">
                            <div class="fa-solid fa-magnifying-glass rounded-full bg-primary-700 hover:bg-primary-600 p-3"></div>
                        </button>
                    </div>

                    <div class="basis-1/12 flex items-center relative">
                        <button on:click={() => filterOpen = !filterOpen} class="w-full flex justify-center">
                            <div class="text-xl fa-solid fa-filter rounded-lg py-1 px-4 bg-primary-700 hover:bg-primary-600"></div>
                        </button>
                        {#if filterOpen}
                            <div class="absolute z-10 top-12 right-2 bg-primary-700 rounded-lg border border-primary-800 w-32">
                                <p class="py-1 text-left hover:bg-primary-600 px-4 rounded-t-lg">All</p>
                                <p class="py-1 text-left hover:bg-primary-600 px-4">Street</p>
                                <p class="py-1 text-left hover:bg-primary-600 px-4">Cuisine</p>
                                <p class="py-1 text-left hover:bg-primary-600 px-4 rounded-b-lg">Name</p>
                            </div>
                        {/if}
                    </div>
                    
                </div>
                <div class="flex">
                    {#each areaList as area, index}
                        <button on:click={() => filterBorough(index)} class="flex border border-primary-700 py-1 px-2 m-1 rounded-full bg-primary-800 text-sm hover:border-primary-500">{area}</button>
                    {/each}
                </div>
            </div>
		</div>

        <div class="flex flex-wrap p-4 w-full">
            {#each areas as area}
                <div class="basis-full md:basis-6/12 lg:basis-4/12 p-1 mb-4">
                    <img src="../restaurant_default.jpg" alt="logo" class="rounded-lg shadow-lg"/>
                    <div class="px-2">
                        <p class="font-bold">{area.name}</p>
                        <div class="flex items-center">
                            <i class="fa-solid fa-location-dot mr-2"></i>
                            <p class="text-primary-600">{area.address.building} {area.address.street} {area.borough} {area.address.zipcode}</p>
                        </div>
                        <div class="flex items-center">
                            <i class="fa-solid fa-bowl-food mr-2"></i>
                            <p class="text-primary-600">{area.cuisine}</p>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
	</div>
{:else}
	<Authorization />
{/if}