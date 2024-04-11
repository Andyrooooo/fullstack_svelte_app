import { json } from '@sveltejs/kit'
import clientPromise from '$lib/mongodb/mongodb.client'
import { ObjectId } from 'mongodb'

export async function GET() {

    const client = await clientPromise
    const db = client?.db('sample_restaurants')
    const collection = db?.collection('restaurants')

    const result = await collection?.find({}).limit(100).toArray()

    /* const result = await collection?.find({}).toArray() */

    // return json(result)
    return new Response(JSON.stringify(result), {status: 200})
}

export async function POST({ request }) {
    // gets the type and the data from the request
    const { type, ...data } = await request.json()
    const client = await clientPromise
    const db = client?.db('sample_restaurants')
    const collection = db?.collection('restaurants')

    let result

    if (type === 'borough') {
        
        result = await collection?.find({ borough: data.borough }).limit(25).toArray()
    } else if (type === 'street') {

        console.log(data)
        result = await collection?.find({ "address.street": data.street }).limit(25).toArray()
    } else if (type === 'cuisine') {

        console.log(data)
        result = await collection?.find({ cuisine: data.cuisine }).limit(25).toArray()
    } else if (type === 'name') {

        console.log(data)
       result = await collection?.find({ name: data.name }).limit(25).toArray()
        // result = data
    } else if (type === 'search') {
        
        // this allows us to perform a case-insensitive search so even if the user types in all caps it will still find it if its in the database
        result = await collection?.find({ name: { $regex: new RegExp (data.search, "i") } }).limit(25).toArray()
    } else if (type === 'like') {
        
        result = await collection?.updateOne(
            { _id: new ObjectId(`${data._id}`) },
            { $push: { likes: {user: data.user} } }
        )
        
    } else if (type === 'unlike') {
            
        result = await collection?.updateOne(
            { _id: new ObjectId(`${data._id}`) },
            { $pull: { likes: {user: data.user} } }
        )
    } else if (type === 'likes') { 
        result = await collection?.find({ likes: { user: data.user } }).toArray()
    }

    return json(result)
    // return new Response(JSON.stringify(borough), {status: 200})
}