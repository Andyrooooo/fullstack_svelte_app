<script lang="ts">
	import Authorization from '../auth/+page.svelte'
	import Navigation from '../navigation/+page.svelte'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { grabReservations } from '../grabReservations/grabReservations'

    // areas will give us all the data for the filters
    let areas: any = []
    // holds all the data for the street, cuisine, and name filters
    let areaList: any = []
    let streetList: any = []
    let cuisineList: any = []
    let nameList: any = []
    let restaurantSearch = ""
    let filterOpen = false
    // currentAreas will hold the current restaurants that are being displayed
    let currentAreas: any = []
    // functionalities for the filters
    let rotateStreet = "rotate-0"
    let rotateCuisine = "rotate-0"
    let rotateName = "rotate-0"
    let openStreetList = "h-0"
    let openCuisineList = "h-0"
    let openNameList = "h-0"
    let currentFilter: any

    // random images for the restaurants
    let images = [
        "../restaurant_default.jpg",
        "../restaurant_default2.jpg",
        "../restaurant_default3.jpg",
        "../restaurant_default4.jpg",
        "../restaurant_default5.jpg",
        "../restaurant_default6.jpg",
        "../restaurant_default7.jpg",
        "../restaurant_default8.jpg",
        "../restaurant_default9.jpg",
        "../restaurant_default10.jpg",
        "../restaurant_default11.jpg",
        "../restaurant_default12.jpg",
        "../restaurant_default13.jpg",
        "../restaurant_default14.jpg",
        "../restaurant_default15.jpg",
    ]

    // function to get a random image from the images array
    function getRandomImage() {
        return images[Math.floor(Math.random() * images.length)]
    }

    // when mounted, the page will grab the reservations and the various food data
	onMount(async () => {
		let userEmail = $page?.data?.session?.user?.email
		await grabReservations(userEmail)
        await grabAllFoods()
	})

    // filtering so we don't get the same name more than once (creates a new array with one single value for each borough)
    $: areaList = new Set(areas.map(area => area.borough))
    $: streetList = new Set(areas.map(area => area.address.street))
    $: cuisineList = new Set(areas.map(area => area.cuisine))
    $: nameList = new Set(areas.map(area => area.name))


    // function to grab all the restaurants
    async function grabAllFoods() {
        const response = await fetch('api/food')
        areas = await response.json()
        currentAreas = areas
        currentFilter = "all"
    }

    // function to filter the restaurants by borough
    async function filterBorough(area: string) {

        const response = await fetch('api/food', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type: 'borough', borough: area })
        })
        let data = await response.json()
        currentAreas = data
        currentFilter = { type: 'borough', borough: area }
    }

    // functionalities to the filter modal
    function streetSelected() {
        if (rotateStreet === "rotate-0") {
            openCuisineList = "h-0"
            rotateCuisine = "rotate-0"
            openNameList = "h-0"
            rotateName = "rotate-0"
            rotateStreet = "rotate-180"
            openStreetList = "h-32"
        } else {
            rotateStreet = "rotate-0"
            openStreetList = "h-0"
        }
    }

    function cuisineSelected() {
        if (rotateCuisine === "rotate-0") {
            rotateCuisine = "rotate-180"
            openCuisineList = "h-32"
            openStreetList = "h-0"
            rotateStreet = "rotate-0"
            rotateName = "rotate-0"
            openNameList = "h-0"
        } else {
            rotateCuisine = "rotate-0"
            openCuisineList = "h-0"
        }
    }

    function nameSelected() {
        if (rotateName === "rotate-0") {
            rotateName = "rotate-180"
            openNameList = "h-32 mb-8"
            openCuisineList = "h-0"
            rotateCuisine = "rotate-0"
            openStreetList = "h-0"
            rotateStreet = "rotate-0"
        } else {
            rotateName = "rotate-0"
            openNameList = "h-0"
        }
    }

    // function to filter the restaurants by street
    async function filterByStreet(street: string) {
        
        const response = await fetch('api/food', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type: 'street', street: street })
        })
        let data = await response.json()
        currentAreas = data
        rotateStreet = "rotate-0"
        rotateCuisine = "rotate-0"
        rotateName = "rotate-0"
        openStreetList = "h-0"
        openCuisineList = "h-0"
        openNameList = "h-0"
        filterOpen = false
        currentFilter = { type: 'street', street: street }
    }

    // function to filter the restaurants by cuisine
    async function filterByCuisine(cuisine: string) {
        
        const response = await fetch('api/food', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type: 'cuisine', cuisine: cuisine })
        })
        let data = await response.json()
        currentAreas = data
        rotateStreet = "rotate-0"
        rotateCuisine = "rotate-0"
        rotateName = "rotate-0"
        openStreetList = "h-0"
        openCuisineList = "h-0"
        openNameList = "h-0"
        filterOpen = false
        currentFilter = "cuisine"
        currentFilter = { type: 'cuisine', cuisine: cuisine }
    }

    // function to filter the restaurants by the restaurants names
    async function filterByName(name: string) {
        
        const response = await fetch('api/food', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type: 'name', name: name })
        })
        let data = await response.json()
        console.log(data)
        currentAreas = data
        rotateStreet = "rotate-0"
        rotateCuisine = "rotate-0"
        rotateName = "rotate-0"
        openStreetList = "h-0"
        openCuisineList = "h-0"
        openNameList = "h-0"
        filterOpen = false
        currentFilter = "name"
        currentFilter = { type: 'name', name: name }
    }

    // filters the restaurants based on your search
    async function findSearch() {
        console.log(restaurantSearch)
        const response = await fetch('api/food', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type: 'search', search: restaurantSearch.toLowerCase() })
        })
        let data = await response.json()
        currentAreas = data
        console.log(data)
        restaurantSearch = ""
        currentFilter = { type: 'search', search: restaurantSearch }
    }

    // likes the restaurant
    async function likeRestaurant(area) {

        const response = await fetch('api/food', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type: 'like', user: $page.data.session?.user?.email, _id: area._id })
        })
        
        // nitpicky but it checks the type of filter applied and its value to re-render the restaurants without a refresh
        if (currentFilter === "all") {
            grabAllFoods()
        } else if (currentFilter.type === "borough") {
            filterBorough(currentFilter.borough)
        } else if (currentFilter.type === "street") {
            filterByStreet(currentFilter.street)
        } else if (currentFilter.type === "cuisine") {
            filterByCuisine(currentFilter.cuisine)
        } else if (currentFilter.type === "name") {
            filterByName(currentFilter.name)
        } else if (currentFilter.type === "search") {
            findSearch(currentFilter.search)
        } else if (currentFilter.type === "likes") {
            filterByLikes(currentFilter.user)
        }
    }


    // unlikes the restaurant
    async function unlikeRestaurant(area) {
        console.log(area)

        const response = await fetch('api/food', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type: 'unlike', user: $page.data.session?.user?.email, _id: area._id })
        })
        
        // checks the type of filter applied and its value to re-render the the restaurants without a refresh
        if (currentFilter === "all") {
            grabAllFoods()
        } else if (currentFilter.type === "borough") {
            filterBorough(currentFilter.borough)
        } else if (currentFilter.type === "street") {
            filterByStreet(currentFilter.street)
        } else if (currentFilter.type === "cuisine") {
            filterByCuisine(currentFilter.cuisine)
        } else if (currentFilter.type === "name") {
            filterByName(currentFilter.name)
        } else if (currentFilter.type === "search") {
            findSearch(currentFilter.search)
        } else if (currentFilter.type === "likes") {
            filterByLikes(currentFilter.user)
        }
    }

    // filters the data by based if the object/document contains the user's email
    async function filterByLikes() {
        const response = await fetch('api/food', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type: 'likes', user: $page.data.session?.user?.email })
        })
        let data = await response.json()
        currentAreas = data
        currentFilter = { type: 'likes', user: $page.data.session?.user?.email }
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
                        <input bind:value={restaurantSearch} type="text" class="rounded-full w-full border-2 border-primary-700 pl-4 pr-12 py-2 bg-primary-800 focus:outline-none focus:ring-0 focus:border-primary-500 placeholder:text-primary-600" placeholder="Search for a restaurant..."/>
                        <button on:click={findSearch} class="absolute z-10 right-[1px] h-full">
                            <div class="fa-solid fa-magnifying-glass rounded-full bg-primary-700 hover:bg-primary-600 p-3"></div>
                        </button>
                    </div>

                    <!-- FILTER FUNCTIONALITY  -->
                    <div class="basis-1/12 flex items-center relative">
                        <!-- WE ARE RIGHT HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
                        <button on:click={filterByLikes} class="w-full flex justify-center ml-2">
                            <div class="text-2xl fa-solid fa-heart rounded-lg py-1 px-4 bg-primary-700 hover:bg-primary-600"></div>
                        </button>

                        <button on:click={() => filterOpen = !filterOpen} class="w-full flex justify-center ml-2">
                            <div class="text-2xl fa-solid fa-filter rounded-lg py-1 px-4 bg-primary-700 hover:bg-primary-600"></div>
                        </button>

                        {#if filterOpen}
                            <div class="absolute z-10 top-12 right-14 bg-primary-700 rounded-lg border border-primary-800 w-72 shadow-lg">
                                
                                <div on:click={grabAllFoods} class="py-1 text-left hover:bg-primary-600 px-4 rounded-t-lg cursor-pointer">All</div>
                                
                                <!-- Custom list that when you select 'street' it will open the street list -->
                                <div class="text-left hover:bg-primary-600 py-1">
                                    <div on:click={streetSelected} class="px-4 flex justify-between items-center cursor-pointer">
                                        <p>Street</p>
                                        <div class="fa-solid fa-chevron-down {rotateStreet} transition-all duration-300"></div>
                                    </div>
                                </div>
                                <div class="{openStreetList} overflow-y-scroll transition-all duration-300">
                                    {#each streetList as street}
                                        <div on:click={filterByStreet(street)} class="px-8 py-1 text-left bg-primary-800 hover:bg-primary-600 cursor-pointer">{street}</div>
                                    {/each}
                                </div>

                                <!-- Custom list that when you select 'cuisine' it will open the cuisine list -->
                                <div class="text-left hover:bg-primary-600 py-1">
                                    <div on:click={cuisineSelected} class="px-4 flex justify-between items-center cursor-pointer">
                                        <p>Cuisine</p>
                                        <div class="fa-solid fa-chevron-down {rotateCuisine} transition-all duration-300"></div>
                                    </div>
                                </div>
                                <div class="{openCuisineList} overflow-y-scroll transition-all duration-300">
                                    {#each cuisineList as cuisine}
                                        <div on:click={filterByCuisine(cuisine)} class="px-8 py-1 text-left bg-primary-800 hover:bg-primary-600 cursor-pointer">{cuisine}</div>
                                    {/each}
                                </div>

                                <!-- Custom list that when you select 'name' it will open the name list -->
                                <div class="text-left hover:bg-primary-600 py-1 hover:rounded-b-lg">
                                    <div on:click={nameSelected} class="px-4 flex justify-between items-center cursor-pointer">
                                        <p>Name</p>
                                        <div class="fa-solid fa-chevron-down {rotateName} transition-all duration-300"></div>
                                    </div>
                                </div>
                                <div class="{openNameList} overflow-y-scroll transition-all duration-300">
                                    {#each nameList as name}
                                        <div on:click={filterByName(name)} class="px-8 py-1 text-left bg-primary-800 hover:bg-primary-600 cursor-pointer">{name}</div>
                                    {/each}
                                </div>
                            </div>
                        {/if}

                        <div class="flex items-center">
                            <button on:click={grabAllFoods} class="w-full flex justify-center ml-2">
                                <div class="text-2xl fa-solid fa-xmark rounded-lg py-1 px-4 bg-primary-700 hover:bg-primary-600"></div>
                            </button>
                        </div>
                    </div>

                    
                    
                </div>
                <div class="flex">
                    {#each areaList as area}
                        <button on:click={() => filterBorough(area)} class="flex border border-primary-700 py-1 px-2 m-1 rounded-full bg-primary-800 text-sm hover:border-primary-500">{area}</button>
                    {/each}
                </div>
            </div>
		</div>

        <div class="flex flex-wrap p-4 w-full">
            {#if currentAreas.length === 0}
                    <div class="w-full h-full text-primary-300 flex justify-center items-center mt-40 text-3xl font-bold">
                        <p>No restaurants found</p>
                        <i class="fa-solid fa-face-sad-tear ml-4"></i>
                    </div>
            {:else}
                {#each currentAreas as area}
                    <div class="relative basis-full md:basis-6/12 lg:basis-4/12 p-1 mb-28">
                        {#if area.likes && area?.likes.some(like => like?.user === $page.data.session?.user?.email)}
                            <button on:click={unlikeRestaurant(area, currentAreas)} class="fa-solid fa-heart absolute z-10 top-4 right-4 text-2xl bg-primary-900 px-2 py-1 rounded-full shadow-lg text-primary-200"></button>
                        {:else}
                            <button on:click={likeRestaurant(area, currentAreas)} class="fa-regular fa-heart absolute z-10 top-4 right-4 text-2xl bg-primary-900 px-2 py-1 rounded-full shadow-lg"></button>
                        {/if}
                        <img src={getRandomImage()} alt="logo" class="rounded-lg shadow-lg h-full object-cover "/>
                        <div class="px-2 mt-2">
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
            {/if}
        </div>
	</div>
{:else}
	<Authorization />
{/if}