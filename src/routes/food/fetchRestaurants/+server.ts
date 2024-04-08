import { json } from '@sveltejs/kit'
import clientPromise from '$lib/mongodb/mongodb.client'

export async function GET() {

    const client = await clientPromise
    const db = client?.db('sample_restaurants')
    const collection = db?.collection('restaurants')

    const result = await collection?.find({}).limit(50).toArray()

    /* const result = await collection?.find({}).toArray() */

    return json(result)
}