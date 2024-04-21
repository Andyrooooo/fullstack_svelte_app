import { json } from '@sveltejs/kit'
import clientPromise from '$lib/mongodb/mongodb.client'
import { ObjectId } from 'mongodb'

export async function POST({ request }) {
    const nameReservation = await request.json()

    const client = await clientPromise
    const db = client?.db('DWDD3780')
    const collection = db?.collection('reservations')

    const result = await collection?.deleteOne(
        { _id: new ObjectId(nameReservation._id) }, // find a document with _id // set userName field
    )

    /* const result = await collection?.find({}).toArray() */

    /* const message = {message: "Name sent to reservation!"} */

    return json(result)
}