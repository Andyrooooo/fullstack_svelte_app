
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri)

export async function load() {
    // declares the movie variable
    // let movie

    let movies

  try {
    // Connect the client to the server
    const movieDB =  client.db("sample_mflix")

    // Get the `movies` collection from the `sample_mflix` database
    // const movieColl = movieDB.collection("movie")
    const moviesColl = movieDB.collection("movies")

    // Find a movie with the title "Back to the Future"
    // movie = await moviesColl.findOne({ title: "Back to the Future" })
    // const moviesArray = await moviesColl.find({ year: 2015, 'imdb.rating': { $gte: 9 } }).toArray()
    // ^^^^^^ how can we do some filtering and sorting for the above array of data? 

    const moviesArray = await moviesColl.find({
        $and: [
            { year: {$gte: 1920} }, 
            {'imdb.rating': {$gte: 8} },
            { rated: "R"}
        ]
    }).toArray()

    movies = moviesArray.map(movie => {
        return { ...movie, _id: (movie._id as ObjectId).toString() }
    })

    console.log(`movie List: ${moviesArray.length}`)
  } finally {
    // closes the client connection
    await client.close()
  }
    //   if (movie) {
    //     // converts the ObjectId to a string as BSON because SvelteKit does not support ObjectId
    //     movie = { ...movie, _id: (movie._id as ObjectId).toString() }
    //   }

  return {
    // returns a 200 status code and the movie object
    status: 200,
    // body: movie
    body: movies
  }
}
