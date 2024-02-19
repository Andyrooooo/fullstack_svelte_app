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