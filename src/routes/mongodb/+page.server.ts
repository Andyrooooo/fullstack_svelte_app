
import { MongoClient, ServerApiVersion } from 'mongodb'
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

export async function load() {
  try {
    await client.connect()
    await client.db("DWDD3780").command({ ping: 1 })
    console.log("Pinged your deployment. You successfully connected to MongoDB!")
  } finally {
    await client.close()
  }
  return {
    status: 200,
    body: {
      message: 'MongoDB connection successful!'
    }
  }
}
