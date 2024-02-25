import { ObjectId } from 'mongodb'
import clientPromise from '$lib/mongodb/mongodb.client'

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

export async function load() {
    let client, listings

    try {
        client = await clientPromise

        // grabs airbnb database
        const airBNBDB = client?.db("sample_airbnb")

        // grabs the listingsAndReviews collection
        const listNRevColl = airBNBDB?.collection("listingsAndReviews")

        // grabs US listings with no weekly price, no monthly price, and not in Hawaii, Maui, Island of Hawaiʻi, The Big Island, Oahu, or Kauai
        // theres just too many in the islands and new york
        const listingsArray = await listNRevColl?.find({
            $and: [
                {'address.country_code': "US"},
                {'weekly_price': { $exists: false}},
                // 'security_deposit': { $exists: false},
                {'monthly_price': { $exists: false}},
                {'address.market': { $ne: "Hawaii" }},
                {'address.market': { $ne: "Maui"}},
                {'address.market': { $ne: "Island of Hawaiʻi"}},
                {'address.market': { $ne: "The Big Island"}},
                {'address.market': { $ne: "Oahu"}},
                {'address.market': { $ne: "Kauai"}}
            ]
        }).limit(50).toArray()

        // converts the object id to a string, and adds the image URL, and converts the bathrooms, price, security_deposit, extra_people, guests_included, and cleaning_fee to a float
        listings = await Promise.all((listingsArray || []).map(async (listing) => {
            const imageUrl = await validateImageURL(listing.images.picture_url);
            return { 
                ...listing, 
                _id: (listing._id as ObjectId).toString(),
                bathrooms: listing.bathrooms ? parseFloat(listing.bathrooms.toString()) : 0,
                price: listing.price ? parseFloat(listing.price.toString()) : 0,
                security_deposit: listing.security_deposit ? parseFloat(listing.security_deposit.toString()) : 0,
                extra_people: listing.extra_people ? parseFloat(listing.extra_people.toString()) : 0,
                guests_included: listing.guests_included ? parseFloat(listing.guests_included.toString()) : 0,
                cleaning_fee: listing.cleaning_fee ? parseFloat(listing.cleaning_fee.toString()) : 0,
                image: imageUrl
            }
        }))

    } catch(error) {
        console.log('failed to connect to MongoDB', error)
        
        // closes the client connection if there is an error and the client exists
        if (client) {
            await client.close()
        }
        return {
            status: 500,
            body: 'Failed to connect to MongoDB'
        }
    }

    return {
        // returns a 200 status code and the movie object
        status: 200,
        body: listings
    }

}