# DWDD 3780 Sveltekit Fullstack App
#### Greetings!

#### This is my fullstack app using Svelte. Upon connecting to the site you will be prompted to sign in with your GitHub account. You can view the Vercel site here: [Vercel](https://fullstack-svelte-app.vercel.app/). You can also view the link on the page under the 'about' section. 

### Master Detail Route Using MongoDB
#### I have created a master-detail route using the MongoDB sample data and utilized the 'AirBnB' data. I have used this to create a mock AirBnB site with their available data. If you would like to view the code the link will be here [Listings Detail Route](https://github.com/Andyrooooo/fullstack_svelte_app/tree/master/src/routes/listings)

### Adding a form to action
#### For my iteration of this part of the project I decided early on that it would make more sense to nest all the data inside each dynamic route and that's where I've been going for some time. So, to find the reviews you will first select a listing you want to view, from there you will see "reviews" as one of the first options in the listing and it will also be highlighted. This will bring up a modal with various pieces of data to help you decide if this is the place you want to stay. Once in here you may click on the prompt "Want to add your own review?" to bring up the form. The app has been configured to grab various pieces of data to display in the reviews modal. I have also configured the data to show in a "reviews" collection of the DGM3780 database and send a different version to the "listingAndReviews" collection of the Airbnb database sample. This will look something like this:
[airbnb_sample_db](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/f6f60613-29bc-4853-808b-a5b0841b2b4f)
![dwdd_review_db](https://github.com/Andyrooooo/fullstack_svelte_app/assets/97576252/89668f84-f270-4dd2-b572-790f4b45cfc1)
You can also view the code here and I apologize for its size in advance [Dynamic route server, modal, and client-side code](https://github.com/Andyrooooo/fullstack_svelte_app/tree/master/src/routes/listings/%5B_id%5D)
