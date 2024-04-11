# DWDD 3780 Sveltekit Fullstack App
#### Greetings!

#### This is my fullstack app using Svelte. Upon connecting to the site you will be prompted to sign in with your GitHub account. You can view the Vercel site here: [Vercel](https://fullstack-svelte-app.vercel.app/). You can also view the link on the page under the 'about' section. 

### Master Detail Route Using MongoDB
#### I have created a master-detail route using the MongoDB sample data and utilized the 'AirBnB' data. I have used this to create a mock AirBnB site with their available data. If you would like to view the code the link will be here [Listings Detail Route](https://github.com/Andyrooooo/fullstack_svelte_app/tree/master/src/routes/listings)


### Adding a form to action
#### For my iteration of this part of the project I decided early on that it would make more sense to nest all the data inside each dynamic route and that's where I've been going for some time. So, to find the reviews you will first select a listing you want to view, from there you will see "reviews" as one of the first options in the listing and it will also be highlighted. This will bring up a modal with various pieces of data to help you decide if this is the place you want to stay. Once in here you may click on the prompt "Want to add your own review?" to bring up the form. The app has been configured to grab various pieces of data to display in the reviews modal. I have also configured the data to show in a "reviews" collection of the DGM3780 database and send a different version to the "listingAndReviews" collection of the Airbnb database sample. This will look something like this:
![airbnb_sample_db](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/f6f60613-29bc-4853-808b-a5b0841b2b4f)
![dwdd_review_db](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/89668f84-f270-4dd2-b572-790f4b45cfc1)
You can also view the code here and I apologize for its size in advance [Dynamic route server, modal, and client-side code](https://github.com/Andyrooooo/fullstack_svelte_app/tree/master/src/routes/listings/%5B_id%5D)


### Adding API enpoints
#### For my API I thought it would make sense to use the restaurant sample data to go along with my AirBnB data. So, I have create a page where you are able to look at restaurants with an image, name, address, and type of food. For my endpoints to manipulate the data we have a search feature which will look for a name related to your search and display that result if there is a name. 
![Screenshot 2024-04-10 222234](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/4de1fb19-1ac9-477a-afea-b3b4c05b8bf4)
To the right of that will be a heart icon that filters the restaurants based on your likes. So, you will be able to like restaurants and unlike but they will show in this filter when pressed.
![Screenshot 2024-04-10 222020](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/9a8e8dcd-1044-4ec9-aa41-d01652f8ce28)
![Screenshot 2024-04-10 222213](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/3b5fcc84-dd3f-4a25-90b2-7b09964aa75e)
Next to the right of that will be a list filter functionality which will compile all restaurants into separate lists that you can filter from, this list includes all (all restaurants), street name, cuisine type, and restaurant type.
![Screenshot 2024-04-10 222109](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/b1f07541-10a7-43aa-83fc-2cc105111b73)
The last filtering capabilities will be below in the form of small buttons. These buttons will allow you to filter based on the borough, so, Manhattan, Brooklyn, and so on.
![Screenshot 2024-04-10 222249](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/fe1221e5-0453-4c94-9176-04d8c15d53a2)

In the next section, I made updates with API endpoints related to the AirBnB reservations. Within each dynamic route, you are able to make a reservation. Once the reservation has been made you may view this in your person settings modal at the top right of the screen with a link to also take you to the page. From there you can view all your reservations, make changes to the name on the reservation, and even delete unwanted reservations.
![Screenshot 2024-04-10 222432](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/141b83a4-3edc-4abf-8a5f-bb57c59ad145)
![Screenshot 2024-04-10 222319](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/baa6beeb-5066-4457-bf82-b190cdc28c99)
![Screenshot 2024-04-10 222356](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/78d1d327-51a9-4a2c-bcac-5319e5a9e8d1)
You may view the code in my "food/restaurants" section here: [food component](https://github.com/Andyrooooo/fullstack_svelte_app/tree/master/src/routes/food)
The Food/restaurant API data will be available here: [Food API](https://github.com/Andyrooooo/fullstack_svelte_app/tree/master/src/routes/api/food)
You also see the reservation page AND API data in this file [MyReservation](https://github.com/Andyrooooo/fullstack_svelte_app/tree/master/src/routes/myReservations)
To also make sure the reservation notifications visible on the "person settings modal" there is also a second file with an api endpoint that gets called in all pages. This can be viewed here: [grabReservations](https://github.com/Andyrooooo/fullstack_svelte_app/tree/master/src/routes/grabReservations)


