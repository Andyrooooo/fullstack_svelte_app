import { ObjectId } from 'mongodb'
import clientPromise from '$lib/mongodb/mongodb.client'
import { fail } from '@sveltejs/kit'


// sets default image if the image URL is invalid
async function validateImageURL(url: string): Promise<string | null> {
    try {
        const response = await fetch(url, { method: 'HEAD' })
        if (response.ok) {
            return url
        } else {
            return '/default_listing.jpg'
        }
    } catch (error) {
        return '/default_listing.jpg'
    }
}

// sets default host image if the image URL is invalid
async function validateHostImg(url: string): Promise<string | null> {
    try {
        const response = await fetch(url, { method: 'HEAD' })
        if (response.ok) {
            return url
        } else {
            return '/default-host.jpg'
        }
    } catch (error) {
        return '/default-host.jpg'
    }
}

/* load Params function */
export async function load({ params }) {
    const listingId = params._id

    let client, listing
    // let client

    try {
        client = await clientPromise
        const airBNBDB = client?.db("sample_airbnb")
        const listNRevColl = airBNBDB?.collection("listingsAndReviews")

        // console.log(typeof(listingId), listingId)
        // listing = await listNRevColl?.findOne({ _id: listingId as any })

        // data was already in a string format but could not be read so it is kept as a string
        listing = await listNRevColl?.findOne({ _id: listingId as any })
        // console.log(listing)


        // lots of the data has to be changed to strings because of unsupported types
        if (listing) {
            listing = {
                ...listing,
                _id: (listing._id as ObjectId).toString(),
                bathrooms: listing.bathrooms ? parseFloat(listing.bathrooms.toString()) : 0,
                price: listing.price ? parseFloat(listing.price.toString()) : 0,
                security_deposit: listing.security_deposit ? parseFloat(listing.security_deposit.toString()) : 0,
                extra_people: listing.extra_people ? parseFloat(listing.extra_people.toString()) : 0,
                guests_included: listing.guests_included ? parseFloat(listing.guests_included.toString()) : 0,
                cleaning_fee: listing.cleaning_fee ? parseFloat(listing.cleaning_fee.toString()) : 0,
                image: await validateImageURL(listing.images.picture_url),
                hostIMG: await validateHostImg(listing.host.host_thumbnail_url)
            }
        }
    } catch (error) {
        console.log('failed to connect to MongoDB', error)

        if (client) {
            await client.close()
        }
        return {
            status: 500,
            body: 'Failed to connect to MongoDB'
        }
    }
    return {
        status: 200,
        body: listing
    }
}


async function getUserId(user: string) {
    let client
    try {
        client = await clientPromise
        const userCollection = client?.db("DWDD3780").collection("users")
        // const userCollection = client?.db("DWDD3780")
        const existingUser = await userCollection?.findOne({ name: user })
        if (!existingUser) {
            throw new Error("User does not exist")
        }
        return existingUser?._id
    } catch (error) {
        throw new Error('Failed to get user id')
    }
    
}

async function getListingId(listingName: string) {
    let client
    try {
        client = await clientPromise
        const airBNBDB = client?.db("sample_airbnb")
        const listNRevColl = airBNBDB?.collection("listingsAndReviews")
        // extra code to test if error handling is working
        // const listNRevColl = airBNBDB?.collection("listings")
        const listing = await listNRevColl?.findOne({ name: listingName })
        if (!listing) {
            throw new Error("Listing does not exist")
        }
        return listing?._id
    } catch (error) {
        throw new Error('Failed to get listing id')
    }
    
}

// checks the user, rating, comment, and listing name to see if they are valid
async function getReview(user: string, rating: number, comment: string, listingName: string) {
    let client
    if (user === '') {
        throw new Error("Username is required")
    } 
    if (comment === '') {
        throw new Error("Comment is required")
    } 
    if (listingName === '') {
        throw new Error("Listing name is required")
    }
    // add a review to the database
    const userId = await getUserId(user)
    const listingId = await getListingId(listingName)
    // console.log(userId, listingId, rating, comment, listingName, user)

    try {
        /* ----------------- we add review to class database here ------------------------------ */
        client = await clientPromise
        const reviewCollection = client?.db("DWDD3780").collection("reviews")
        // adds the review to my class database with the user id, rating, comment and listing name. The user property will show as user and the listing will show as listingName
        await reviewCollection?.insertOne({ user: userId, rating, comment, listingName: listingId })

        /* ----------------- we add review to AirBnB database here ------------------------------ */
        const newReview = client?.db("sample_airbnb").collection("listingsAndReviews")
        await newReview?.updateOne(
            {_id: listingId},
            // userId was turned into a string to prevent errors, but is still identifiable and shows as normal in class database
            // also changes property name to match current document structure
            // will show your name as well for review to be seen in reviews
            {$push: {reviews: {listing_id: String(listingId), reviewer_id: String(`ObjectId(${userId})`), reviewer_name: user, comments: comment, rating}}}
        )
        // listing id: 10140368    _id: "10140368"

    } catch (error) {
        throw new Error('Failed to add review')
    }
}

// function which will grab our form data
export const actions = {
    submitForm: async ({ request }) => {
        const data = await request.formData()
        // console.log(data.get('user'), typeof(data.get('user')))
        // console.log(data.get('rating'), typeof(data.get('rating')))
        // console.log(data.get('comment'), typeof(data.get('comment')))
        // console.log(data.get("listingName"), typeof(data.get("listingName")))
        const rating = data.get('rating')
        const user = data.get('user') as string
        const comment = data.get('comment') as string
        const listingName = data.get('listingName') as string

        try {
            await getReview(user, Number(rating), comment, listingName)
            return {
                status: 200,
                body: { message: 'Review added successfully' }
            }
        } catch (error) {
            if (error instanceof Error) 
            return fail(422, {
                error: error.message
            })
        }
    }
}
