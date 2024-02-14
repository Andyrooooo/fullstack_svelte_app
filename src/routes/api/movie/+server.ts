import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri)

export async function GET() {
    // const body = await request.json() 
    // console.log(body)
    return new Response('Hello world!')
}