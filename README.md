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

### search bar enpoint:
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


### liked Restaurants Endpoint:
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


### "Filter By" Endpoint:
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


### "Clear" Endpoint:
![Screenshot 2024-04-29 194103](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/8ba1f87c-99ad-4a17-88a5-02492d8b75e2)
#### The clear (x) button which is located to the right of the "filter by" button will clear searches by re-fetching all data from the database.
```javascript
JavaScript
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
```
```html
HTML
<div class="flex">
    {#each areaList as area}
        <button on:click={() => filterBorough(area)} class="flex border border-primary-600 py-1 px-2 m-1 rounded-full bg- 
        primary-400 text-sm hover:border-primary-700">{area}</button>
    {/each}
</div>
```



### Borough filter button endpoints:
![Screenshot 2024-04-29 201703](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/d3443f2a-6a93-4bbb-be7b-c3686440fef1)
#### The borough filter buttons will be located just below the search bar. This functionality when clicked will filter the data based on its borough. Yes there are only a few but this is all the boroughs inside the database.
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
#### You can view the full code in my "food/restaurants" section here: [food component](https://github.com/Andyrooooo/fullstack_svelte_app/tree/master/src/routes/food)
#### The Food/restaurant API data will be available here: [Food API](https://github.com/Andyrooooo/fullstack_svelte_app/tree/master/src/routes/api/food)




## Making a reservation & Reservations page
![Screenshot 2024-04-29 202513](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/2c26a9fb-5b80-4092-a261-c1425523d5c6)


### Making a reservation
![Screenshot 2024-04-29 202837](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/e8dd57d7-2364-4b9d-b117-b6cb069a6462)
#### For additional endpoints and for the sake of finishing the "making a reservation" within each dynamic route I have built this component. If you navigate to any dynamic route so clicking the "listings" button in the navigation and selecting any listing you will stumble upon this reservation form. There is error handling so, dont worry about making any mistakes here. Upon completion of your reservation, you will be prompted with a notification that you have made a reservation and will also be notified of how to check your reservations. (unfortunately due to it's size I have only included the HTML)
```html
HTML
<form on:submit|preventDefault={sendReservation}>
    <p class="mx-4"><a class="font-bold text-lg">${data?.body?.price}.00</a> night</p>

    <div class="mx-4 mt-4 mb-8">
        <label for="numberOfNights" class="text-primary-200 mb-1">{$page.data.session?.user?.name}, how many nights are you staying?</label>
        <select name="nights" id="numberOfNights" class="px-4 w-full rounded-lg bg-primary-300 border border-primary-400 focus:border-primary-800 focus:ring-0 " bind:value={numberOfNights} required>
            <option class="bg-primary-300 text-primary-900" value="1">1 night</option>
            <option class="bg-primary-300 text-primary-900" value="2">2 nights</option>
            <option class="bg-primary-300 text-primary-900" value="3">3 nights</option>
            <option class="bg-primary-300 text-primary-900" value="4">4 nights</option>
            <option class="bg-primary-300 text-primary-900" value="5">5 nights</option>
            <option class="bg-primary-300 text-primary-900" value="6">6 nights</option>
            <option class="bg-primary-300 text-primary-900" value="7">7 nights</option>
        </select>
    </div>

    <div class="mx-4 mt-4 mb-8 flex gap-4">
        <div class="basis-6/12">
            <label for="dates" class="text-primary-200 mb-1">Check In</label>
            <input type="date" class="px-4 w-full rounded-lg bg-primary-300 border border-primary-400 focus:border-primary-800 focus:ring-0 text-primary-900" bind:value={dates.start} required/>
        </div>
        <div class="basis-6/12">
            <label for="dates" class="text-primary-200 mb-1">Check Out</label>
            <input type="date" class="px-4 w-full rounded-lg bg-primary-300 border border-primary-400 focus:border-primary-800 focus:ring-0 text-primary-900" bind:value={dates.end} required/>
        </div>
    </div>

    <div class="mx-4 mb-8">
        <button class="py-2 w-full bg-primary-900 text-primary-50 rounded-lg hover:rounded-2xl transition-all duration-300" >Reserve</button>
    </div>

    <div class="flex justify-between px-4 py-2 text-primary-50">
        <p>${data?.body?.price} x {numberOfNights} {numberOfNights > 1 ? "Nights" : "Night"}</p>
        <p>${data?.body?.price * numberOfNights}</p>
    </div>

    <div class="flex justify-between px-4 py-2 text-primary-50">
        <p>Cleaning Fee</p>
        <p>${data?.body?.cleaning_fee}</p>
    </div>

    <div class="flex justify-between pt-2 px-4 text-primary-50">
        <p>Airbnb Service Fee</p>
        <p>$60</p>
    </div>

    <div class="flex justify-between pt-2 border-b border-primary-800 m-4 mt-2 pb-4 text-primary-50">
        <p>Taxes</p>
        <p>${(((data?.body?.price * numberOfNights) + 60 + (data?.body?.cleaning_fee)) * .10).toFixed(2)}</p>
    </div>

    <div class="flex justify-between px-4 pb-4 text-primary-50">
        <p>Total</p>
        <p>${(((((data?.body?.price * numberOfNights) + 60 + (data?.body?.cleaning_fee)) * .10)) + (data?.body.price * numberOfNights) + 60 + (data?.body?.cleaning_fee)).toFixed(2)}</p>
    </div>
</form>
```



### Checking your Reservation
![Screenshot 2024-04-29 203954](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/4109c479-6a26-4fa2-9ab1-7bff33207187)
#### As I mentioned, once you make a reservation you can view them by clicking your profile picture. This will open your menu where you will see "reservations" along with the number of reservations you have. This is also viewable on each page so, you can be on any page within the site and still view your reservation numbers. When you click the reservation text you will be routed to the reservations page.
```html
HTML
<!-- this tells us how many reservations there are and when hovered gives us a nice bottom border -->
<div class="flex items-center">
    <i class="fa-solid fa-suitcase mr-2 {numberOfReservations.length < 1 ? "text-primary-200" : "text-primary-300"}"></i>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a 
    href="../myReservations"
    on:mouseenter={highlight} 
    on:mouseleave={unHighlight} 
    class="{numberOfReservations.length < 1 ? "text-primary-200" : "text-primary-300"} cursor-pointer border-primary-300">
    Reservations
    </a>
    <div class="ml-1 py-0.5 px-[7px] bg-primary-300 rounded-full text-xs">{numberOfReservations.length}</div>
</div>
<div class="border-primary-50 border-b-2 {border} transition-all duration-300 mt-1 rounded-full"></div>

<div class="border border-t-primary-800 border-b-0 border-l-0 border-r-0 mt-4 pt-4 flex justify-center">
    <button class="py-2 px-4 bg-primary-900 rounded-lg hover:rounded-2xl text-primary-50 transition-all duration-300" on:click={handleSignOut}>Sign Out</button>
</div>
```
#### This code where for the person settings modal is viewable in the "auth" file here: [auth](https://github.com/Andyrooooo/fullstack_svelte_app/blob/master/src/routes/auth/%2Bpage.svelte)

#### To also make sure the reservation notifications visible on the "person settings modal" there is file with an api endpoint that gets called in all pages. It is then saved to a svelte store that can be utilized throughout my code. This can be viewed here: [grabReservations](https://github.com/Andyrooooo/fullstack_svelte_app/tree/master/src/routes/grabReservations)
#### The code used to grab the reservations for each page will look like this:
```javascript
JavaScript
// Grabs the reservations when mounted and sends the users email to get ONLY their reservations
onMount(() => {
    let userEmail = $page?.data?.session?.user?.email
    grabReservations(userEmail)
})
```








#### You also see the reservation page AND API data in this file [MyReservation](https://github.com/Andyrooooo/fullstack_svelte_app/tree/master/src/routes/myReservations)


### Final Refinements and additions
#### To finalize this project I decided to update and universalize my "notification" modals. These are modals that will display for various user interactions. This includes warnings, regular notifications, review submissions, and reservations. THey will look something like this:
![Screenshot 2024-04-26 170206](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/2b658247-c551-4800-b4ba-2c17a5eb59b6)
You can also view these modals here: [modal one and two component and store](https://github.com/Andyrooooo/fullstack_svelte_app/tree/master/src/routes/airbnb)

#### Finally the page will display animations on the login page and home page that give insight and additional information to users who login.
