
import { ObjectId } from 'mongodb'
import clientPromise from '$lib/mongodb/mongodb.client'

export async function load() {

    let movies
    let client

  try {
    // Connect the client to the server
    client = await clientPromise

    // creates a variable storing the `sample_mflix` database
    const movieDB = client?.db("sample_mflix")

    // creates a variable storing the `movies` collection
    const moviesColl = movieDB?.collection("movies")

    // Get the `movies` collection from the `sample_mflix` database with the following filters
    const moviesArray = await moviesColl?.find({
        $and: [
            { year: {$gte: 1920} }, 
            {'imdb.rating': {$gte: 8} },
            { rated: "R"}
        ]
    }).toArray()

    // converts the ObjectId to a BSON string because SvelteKit does not support ObjectId
    movies = moviesArray?.map(movie => {
        return { ...movie, _id: (movie._id as ObjectId).toString() }
    })

    console.log(`movie List: ${moviesArray?.length}`)
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
    body: movies
  }
}



// export async function load() {
//     // declares the movie variable
//     let movie

//   try {
//     // Connect the client to the server
//     const movieDB =  client.db("sample_mflix")

//     // Get the `movies` collection from the `sample_mflix` database
//     const movieColl = movieDB.collection("movie")


//     // Find a movie with the title "Back to the Future"
//     movie = await movieColl.findOne({ title: "Back to the Future" })
//     // const moviesArray = await moviesColl.find({ year: 2015, 'imdb.rating': { $gte: 9 } }).toArray()
//     // ^^^^^^ how can we do some filtering and sorting for the above array of data? 

//   } finally {
//     // closes the client connection
//     await client.close()
//   }

// if (movie) {
// // converts the ObjectId to a string as BSON because SvelteKit does not support ObjectId
// movie = { ...movie, _id: (movie._id as ObjectId).toString() }
// }

//   return {
//     // returns a 200 status code and the movie object
//     status: 200,
//     body: movie
//   }
// }