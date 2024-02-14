import clientPromise from '$lib/mongodb/mongodb.client'
import { ObjectId } from 'mongodb'

async function validateImageURL(url: string): Promise<string | null> {
    try {
        const response = await fetch(url, { method: 'HEAD' })
        if (response.ok) {
            return url
        } else {
            return '/default-movie.jpg'
        }
    } catch (error) {
        return '/default-movie.jpg'
    }
}

export async function load({ params }) {
    const movieId = params._id
    // console.log(`movieId: ${movieId}`)

    let client, movie

    try {
        client = await clientPromise
        const movieDB = client?.db("sample_mflix")
        const moviesColl = movieDB?.collection("movies")
        movie = await moviesColl?.findOne({ _id: new ObjectId(movieId) })

        if (movie) {
            movie = {
                ...movie,
                _id: (movie._id as ObjectId).toString(),
                poster: await validateImageURL(movie.poster)
            }
        }
        // console.log("found movie", movie)
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
        body: movie
    }
}

// Were at 39:05 of the video from Feb 12