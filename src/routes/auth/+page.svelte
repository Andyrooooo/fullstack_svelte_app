<script lang="ts">
    import { signIn, signOut } from '@auth/sveltekit/client'
    import { page } from '$app/stores'
    import { reservations } from '../airbnb/airbnbStore'

    let userDetails = false
    let border = "w-0"

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
        border = "w-8/12"
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
        {#if userDetails}
            <div class="absolute z-40 bg-primary-900 p-4 right-4 rounded-lg border border-primary-800 shadow-lg mt-2"> 
                <p class="">
                    <i class="fa-solid fa-signature mr-2"></i>
                    {$page.data.session.user.name}
                </p>

                <p class="">
                    <i class="fa-solid fa-envelope mr-2"></i>
                    {$page.data.session.user.email}
                </p>

                <div class="flex items-center">
                    <i class="fa-solid fa-suitcase mr-2 {numberOfReservations.length < 1 ? "text-primary-50" : "text-primary-400"}"></i>
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a 
                    href="../myReservations"
                    on:mouseenter={highlight} 
                    on:mouseleave={unHighlight} 
                    class="{numberOfReservations.length < 1 ? "text-primary-50" : "text-primary-400"} cursor-pointer border-primary-600">
                    Reservations
                    </a>
                    <div class="ml-1 py-0.5 px-[7px] bg-primary-700 rounded-full text-xs">{numberOfReservations.length}</div>
                </div>
                <div class="border-primary-600 border-b-2 {border} transition-all duration-300 mt-1"></div>
                
                <div class="border border-t-primary-800 border-b-0 border-l-0 border-r-0 mt-4 pt-4 flex justify-center">
                    <button class="py-2 px-4 bg-primary-700 rounded-lg hover:bg-primary-600 hover:text-primary-200" on:click={handleSignOut}>Sign Out</button>
                </div>
            </div>
        {/if}
{:else}
    <div class="absolute  z-40 w-full h-screen flex justify-center items-center">
        <div class="bg-primary-900 p-4 rounded-lg border border-primary-800 shadow-lg w-3/6">
            <p class="text-center mb-4">Sign in using GitHub</p>

            <div class="flex justify-center">
                <i class="fa-brands fa-github text-9xl"></i>
            </div>

            <div class="flex justify-center mt-4 border border-t-primary-800 border-b-0 border-l-0 border-r-0 pt-4">
                <button class="rounded-lg bg-primary-700 py-2 px-4 hover:bg-primary-600 hover:text-primary-200" on:click={handleSignIn}>Sign in</button>
            </div>
        </div>
    </div>
{/if}