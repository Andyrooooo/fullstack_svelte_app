<script lang="ts">
    export let data: any


</script>

<main class="flex justify-center">
    <div class="w-6/12 bg-white text-black rounded-lg p-4 mt-8 flex">
        <div class="flex justify-center pb-4 basis-4/12">
            <img src={data?.body?.poster} alt="{data?.body?.title}" class="w-40 h-60 rounded-lg"/>
        </div>

        <div class="basis-8/12 px-4">
            <div class="flex justify-between my-4">
                <p class="font-bold">{data?.body?.title}</p>
                <p>{data?.body?.year}</p>
                <p>{data?.body?.rated}</p>
            </div>
    
            <p>{data?.body?.plot}</p>
        </div>
    </div>
</main>