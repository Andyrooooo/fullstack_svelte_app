import { json } from '@sveltejs/kit'
import clientPromise from '$lib/mongodb/mongodb.client'

export async function POST({ request }) {
    const email = await request.json()

    console.log(email)

    const client = await clientPromise
    const db = client?.db('DWDD3780')
    const collection = db?.collection('reservations')

    const result = await collection?.find({userEmail: email.email}).toArray()

    /* const result = await collection?.find({}).toArray() */

    return json(result)
}