<script lang="ts">
    import { signIn, signOut } from '@auth/sveltekit/client'
    import { page } from '$app/stores'
    import { reservations } from '../airbnb/airbnbStore'

    let userDetails = false
    let border = "w-0"
    let infoDetails = false

    function handleSignOut() {
        signOut()
    }

    function handleSignIn() {
        signIn('github')
    }

    function openDetails() {
        userDetails = !userDetails
    }


    // reactive statement to get the number of reservations
    let numberOfReservations = $reservations
    $: numberOfReservations = $reservations

    function highlight() {
        border = "w-9/12"
    }
    function unHighlight() {
        border = "w-0"
    }

</script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if $page.data.session?.user}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a on:click={openDetails}>
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img src={$page?.data?.session?.user?.image} alt="users profile picture" class="w-10 rounded-full p-1 hover:bg-primary-800">
    </a>
        <!-- when the users profile picture is clicked it opens this menu -->
        {#if userDetails}
            <div class="absolute z-40 bg-primary-700 p-4 right-4 rounded-lg border border-primary-600 shadow-lg mt-2"> 
                <p class="text-primary-900">
                    <i class="fa-solid fa-signature mr-2"></i>
                    {$page.data.session.user.name}
                </p>

                <p class="text-primary-900">
                    <i class="fa-solid fa-envelope mr-2"></i>
                    {$page.data.session.user.email}
                </p>

                <!-- this tells us how many reservations there are and when hovered gives us a nice bottom border -->
                <div class="flex items-center">
                    <i class="fa-solid fa-suitcase mr-2 {numberOfReservations.length < 1 ? "text-primary-200" : "text-primary-300"}"></i>
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a 
                    href="../myReservations"
                    on:mouseenter={highlight} 
                    on:mouseleave={unHighlight} 
                    class="{numberOfReservations.length < 1 ? "text-primary-200" : "text-primary-300"} cursor-pointer border-primary-300">
                    Reservations
                    </a>
                    <div class="ml-1 py-0.5 px-[7px] bg-primary-300 rounded-full text-xs">{numberOfReservations.length}</div>
                </div>
                <div class="border-primary-50 border-b-2 {border} transition-all duration-300 mt-1 rounded-full"></div>
                
                <div class="border border-t-primary-800 border-b-0 border-l-0 border-r-0 mt-4 pt-4 flex justify-center">
                    <button class="py-2 px-4 bg-primary-900 rounded-lg hover:rounded-2xl text-primary-50 transition-all duration-300" on:click={handleSignOut}>Sign Out</button>
                </div>
            </div>
        {/if}
{:else}

<!-- if the user is not signed in this is what they will see with various hover effects -->
    <div class="absolute top-10 md:top-1/4 lg:top-1/3 z-40 w-full flex justify-center">
        <p class="hover-effect hover-side text-xl px-6 py-2 text-primary-50 rounded-lg font-bold shadow-xl flex gap-2 bg-primary-700 border border-primary-600">
            <i class="fa-solid fa-home text-xl text-primary-50"></i>
            Andrew Kesters Listings
        </p>
    </div>
    <div class="absolute z-40 w-full h-screen flex justify-center items-center">
        <div class="absolute z-50 bg-primary-700 border border-primary-600 p-4 rounded-lg border text-primary-50 shadow-lg w-1/2 bg-opacity-90">

            <p class="text-center mb-4">Sign In Using GitHub</p>

            <div class="flex justify-center">
                <i class="fa-brands fa-github text-9xl"></i>
            </div>

            <div class="flex justify-center mt-4 border border-t-primary-800 border-b-0 border-l-0 border-r-0 pt-4">
                <button class="rounded-lg bg-primary-900 py-2 px-4 hover:rounded-xl transition-all duration-300" on:click={handleSignIn}>Sign In</button>
            </div>
        </div>
    </div>

    <!-- small notification icon that when hovered will give you a link to github to create an account -->
    <div on:mouseover={() => {infoDetails = true}} on:mouseleave={() => {infoDetails = false}} class="absolute bottom-4 right-4 z-50">
        <p class="fa-solid fa-question bg-primary-900 text-primary-50 text-xl px-4 py-2 rounded-full"></p>
    </div>

    <div on:mouseover={() => {infoDetails = true}} on:mouseleave={() => {infoDetails = false}} class="w-10 {infoDetails ? "w-auto pl-4 pr-14" : "w-10 px-0"} translate-all duration-300 bg-primary-700 bg-opacity-20 absolute z-40 bottom-4 right-4 h-11 rounded-full flex items-center justify-center">
        <p class="{infoDetails ? "block" : "hidden"}">If you don't have an account you can create one here <a class="font-bold text-primary-700 cursor-pointer hover:text-primary-900" href="https://github.com/home?ef_id=_k_9fcc147808ff1957325d725b42fa7bb1_k_&OCID=AIDcmmcwpj1e5v_SEM__k_9fcc147808ff1957325d725b42fa7bb1_k_&msclkid=9fcc147808ff1957325d725b42fa7bb1">GitHub</a></p>
    </div>
{/if}

<!-- https://github.com/home?ef_id=_k_9fcc147808ff1957325d725b42fa7bb1_k_&OCID=AIDcmmcwpj1e5v_SEM__k_9fcc147808ff1957325d725b42fa7bb1_k_&msclkid=9fcc147808ff1957325d725b42fa7bb1 -->

<style>
    .hover-effect {
        animation: hover-effect 2s infinite;
    }

    .hover-side {
        animation: hover-side 2s infinite;
    }

  

    @keyframes hover-effect {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-15px);
        }
    }

    @keyframes hover-side {
        0%, 100% {
            transform: translateY(0) rotate(0deg);
        }
        50% {
            transform: translateY(-25px) rotate(1deg);
        }
    }

   
</style>