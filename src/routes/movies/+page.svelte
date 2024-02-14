<script lang="ts">

    export let data: any

    // $: console.log(data.body)

    async function fetchMovie(id: string) {
        const res = await fetch('/api/movie')
        // const movie = await res.json()
        console.log(res)
    }

</script>

<main class="p-4">
    <h1 class="text-red-500">{data.body.length} Movies</h1>
    <div class="flex flex-wrap">
        {#each data.body as movie}
            <div class="basis-2/6 ">
                <div class="card m-1">
                    <!-- <div class="card-body flex justify-center">
                        <img src={movie.poster} alt="{movie.title}" class="max-w-32"/>
                    </div> -->
                    <div class="card-header">
                        <h2 class="text-center">{movie.title}</h2> 
                    </div>
                    <!-- <div class="card-footer flex justify-between">
                        <img src={movie.poster}  alt="{movie.title}" class="rounded-full max-w-5"/>
                        <p>Rated: {movie.rated}</p>
                        <p>Year: {movie.year}</p>
                    </div> -->
                    <!-- <div class="flex justify-center"> -->
                        <a href={`/movies/${movie._id}`} class="btn btn-primary py-2 px-4 rounded-full border my-4 hover:text-blue-950 hover:bg-white">View</a>
                    <!-- </div> -->
                </div>
            </div>
        {/each}
    </div>
</main>