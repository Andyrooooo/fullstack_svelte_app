# DWDD 3780 Sveltekit Fullstack App

![Screenshot 2024-04-29 163319](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/5f06079e-c333-4b58-8989-27f6996b60a6)

#### Greetings!
#### This is my fullstack app using Svelte. Upon connecting to the site you will be prompted to sign in with your GitHub account. You can view the Vercel site here: [Vercel](https://fullstack-svelte-app.vercel.app/). You can also view the link on the page under the 'about' section. You may also view the site at its final location on my domain [andrew-j-kester](https://www.andrew-j-kester.com/)

## Master Detail Route Using MongoDB
![Screenshot 2024-04-29 164318](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/76697220-158b-4ae5-9720-3de7dc86bdf3)

#### I have created a master-detail route using the MongoDB sample data and utilized the 'AirBnB' data. The idea is when you click the "listing" button in the navigation it will take you to the listings page filled with neat cards. When you hover over a card it will prompt you to view the listing by clicking it which will take you to each dynamic route with lots of information for each listing. If you would like to view the code the link will be here [Listings Detail Route](https://github.com/Andyrooooo/fullstack_svelte_app/tree/master/src/routes/listings)


## Adding a form to action
![Screenshot 2024-04-29 165731](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/0103c8c6-8f5b-45ac-9b9a-24e6d3535768)
#### For the "form to action" section I have added a "review" form. When you are in each dynamic route you will select "reviews" which will be highlighted. From there you will see the above modal filled with reviews and ratings of the listing. If you click the "want to add your own review", it will bring up a section to submit a review. When your review is submitted you will be able to view your review inside the list of existing reviews. When the form is submitted it will be sent to two separate collections, one for my personal collection and one to the AirBnB sample data.
![airbnb_sample_db](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/f6f60613-29bc-4853-808b-a5b0841b2b4f)
![dwdd_review_db](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/89668f84-f270-4dd2-b572-790f4b45cfc1)
#### The form code will also look like this inside the dynamic route:
```html
HTML
<form class=" w-full h-full flex justify-center items-center p-4 " method="POST" action="?/submitForm">
    <div class="w-full">

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
                        <i class="fa-solid fa-star text-3xl text-primary-200"></i>
                    {:else}
                        <i class="fa-regular fa-star text-3xl text-primary-200"></i>
                    {/if}
                </div>
            {/each}
        </div>


        <!-- label and textarea elements for the users comment -->
        <div class="flex justify-center">
            <div class="w-full md:w-8/12 lg:w-6/12">
                <label for="comment" class="text-primary-200">Comments</label>
                <textarea name="comment"  class="w-full h-32 mt-2 rounded-lg bg-primary-800 border border-primary-800 placeholder-primary-500 focus:ring-0 focus:border-primary-500 focus:outline-none text-primary-200" placeholder="Your review..." required />
            </div>
        </div>

        <!-- submit and cancel button -->
        <div class="flex justify-center mt-4">
            <button class="py-2 px-4 bg-primary-600 rounded-lg hover:rounded-2xl transition-all duration-300 text-primary-200 mx-4" type="submit">Submit</button>
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
```
You can also view the code here and I apologize for its size in advance [Dynamic route server, modal, and client-side code](https://github.com/Andyrooooo/fullstack_svelte_app/tree/master/src/routes/listings/%5B_id%5D)


## Adding API endpoints
![Screenshot 2024-04-29 184059](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/0a19c5f4-fd12-4048-b026-85f4b5f472d1)

#### KEEP IN MIND - The data does not have images so they are dynamically placed into each restaurant at random, so the data will change but the images may not change.
#### My API endpoints will span two pages. The first will be the "foods" page. In the navigation, if you click the "food" text it will bring you to the image above. The page will feature images (which will be dynamically placed with the information) with text featuring the restaurant name, address, and food type. You will also see a heart icon placed inside each image which will allow you to "like" the listing and save it to a selection of saved restaurants.

### Our first API endpoint will come in the form of a search bar.
![Screenshot 2024-04-29 185300](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/06db4844-7573-4004-bbe8-07071791492e)
The search bar will allow you to search the names of restaurants and upon clicking on the magnifying glass icon will initiate the search feature and will search the database for your input.
```javascript
JavaScript
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
    restaurantSearch = ""
    currentFilter = { type: 'search', search: restaurantSearch }
}
```
```html
HTML
<div class="relative basis-11/12">
    <input bind:value={restaurantSearch} type="text" class="rounded-full w-full border-2 border-primary-600 pl-4 pr-12 py-2 bg- 
       primary-300 focus:outline-none focus:ring-0 focus:border-primary-700 placeholder:text-primary-600" placeholder="Search 
       for a restaurant..."/>
    <button on:click={findSearch} class="absolute z-10 right-[1px] h-full">
        <div class="fa-solid fa-magnifying-glass rounded-full bg-primary-700 hover:bg-primary-600 p-3"></div>
    </button>
</div>
```


### liked Restaurants Endpoint
<img width="904" alt="Screenshot 2024-04-29 190554" src="https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/8defde1e-a764-4a99-b02a-27677e2ab58f">

#### To the right of the search endpoint will be the "liked" filter functionality. This button(with the heart) will grab all the restaurants you have liked from the database. This functionality is specific to you by your email so you will only see restaurants YOU liked. It corresponds to the heart you will see on each image and when clicked will add to your list of liked restaurants. You may also see below the second function "likeRestaurant" this function is when the user clicks the heart icon on the image. It will add their email to the specific document and base on the type of filter currently in use will allow it to refresh.

```javascript
JavaScript
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
```
```html
HTML
<button on:click={filterByLikes} class="w-full flex justify-center ml-2">
    <div class="text-2xl fa-solid fa-heart rounded-lg py-1 px-4 bg-primary-700 hover:bg-primary-600"></div>
</button>

{#if area.likes && area?.likes.some(like => like?.user === $page.data.session?.user?.email)}
    <button on:click={unlikeRestaurant(area, currentAreas)} class="fa-solid fa-heart absolute z-10 top-4 right-4 text-2xl bg- 
     primary-700 px-2 py-1 rounded-full shadow-lg text-primary-300"></button>
{:else}
    <button on:click={likeRestaurant(area, currentAreas)} class="fa-regular fa-heart absolute z-10 top-4 right-4 text-2xl bg- 
    primary-700 px-2 py-1 rounded-full shadow-lg text-primary-300"></button>
{/if}
<img src={getRandomImage()} alt="logo" class="rounded-lg shadow-lg h-full object-cover "/>
![Screenshot 2024-04-10 222109](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/b1f07541-10a7-43aa-83fc-2cc105111b73)
```


### "Filter By" Endpoint
![Screenshot 2024-04-29 192456](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/203da9b4-a2f4-4698-bab3-eb541025b1d6)
#### This filter will be located to the right of the heart button. This endpoint will grab all the cuisine, street, and restaurant names from the database and put them into a filter modal. when you open a modal you can click and one of the options to filter the displayed restaurants with that filter to find all in the database that match its criteria.(due to size I have only included the HTML)
```html
HTML
{#if filterOpen}
    <div class="absolute z-10 top-12 right-14 bg-primary-700 rounded-lg border border-primary-600 w-72 shadow-lg text-primary-300">
        
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
```


### "Clear" Endpoint
#### The clear (x) button which is located to the right of the "filter by" button will clear searches by re-fetching all data from the database.
```javascript
JavaScript
// function to grab all the restaurants
async function grabAllFoods() {
    const response = await fetch('api/food')
    areas = await response.json()
    currentAreas = areas
    currentFilter = "all"
}
```
```html
HTML
<div class="flex items-center">
    <button on:click={grabAllFoods} class="w-full flex justify-center ml-2">
        <div class="text-2xl fa-solid fa-xmark rounded-lg py-1 px-4 bg-primary-700 hover:bg-primary-600"></div>
    </button>
</div>
```

#### The last filtering capabilities will be below in the form of small buttons. These buttons will allow you to filter based on the borough, so, Manhattan, Brooklyn, and so on.
![Screenshot 2024-04-10 222249](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/fe1221e5-0453-4c94-9176-04d8c15d53a2)

#### In the next section, I made updates with API endpoints related to the AirBnB reservations. Within each dynamic route, you are able to make a reservation. (make sure you don't pick a date that's in the past and make sure your amount of nights match when selecting your dates or the app will remind you) 
![Screenshot 2024-04-10 222432](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/141b83a4-3edc-4abf-8a5f-bb57c59ad145)
#### Once the reservation has been made you may view this in your person settings modal at the top right of the screen with a link to also take you to the page. From there you can view all your reservations, make changes to the name on the reservation, and even delete unwanted reservations.
![Screenshot 2024-04-10 222319](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/baa6beeb-5066-4457-bf82-b190cdc28c99)
![Screenshot 2024-04-29 181544](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/9459e016-9ae7-4f91-854c-5b7060aaa1fb)
#### You may view the code in my "food/restaurants" section here: [food component](https://github.com/Andyrooooo/fullstack_svelte_app/tree/master/src/routes/food)
#### The Food/restaurant API data will be available here: [Food API](https://github.com/Andyrooooo/fullstack_svelte_app/tree/master/src/routes/api/food)
#### You also see the reservation page AND API data in this file [MyReservation](https://github.com/Andyrooooo/fullstack_svelte_app/tree/master/src/routes/myReservations)
#### To also make sure the reservation notifications visible on the "person settings modal" there is also a second file with an api endpoint that gets called in all pages. This can be viewed here: [grabReservations](https://github.com/Andyrooooo/fullstack_svelte_app/tree/master/src/routes/grabReservations)

### Final Refinements and additions
#### To finalize this project I decided to update and universalize my "notification" modals. These are modals that will display for various user interactions. This includes warnings, regular notifications, review submissions, and reservations. THey will look something like this:
![Screenshot 2024-04-26 170206](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/2b658247-c551-4800-b4ba-2c17a5eb59b6)
You can also view these modals here: [modal one and two component and store](https://github.com/Andyrooooo/fullstack_svelte_app/tree/master/src/routes/airbnb)

#### Finally the page will display animations on the login page and home page that give insight and additional information to users who login.
