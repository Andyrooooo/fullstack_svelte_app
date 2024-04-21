import { json } from '@sveltejs/kit'
import clientPromise from '$lib/mongodb/mongodb.client'

export async function POST({request}) {
    const data = await request.json()

    const client = await clientPromise
    const db = client?.db('DWDD3780')
    const collection = db?.collection('reservations')

    const result = await collection?.insertOne(data)

    return json(data)
}