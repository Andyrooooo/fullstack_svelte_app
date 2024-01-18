<script>
    import { signIn, signOut } from '@auth/sveltekit/client'
    import { page } from '$app/stores'

    function handleSignOut() {
        signOut()
    }

    function handleSignIn() {
        signIn('github')
    }
</script>


{#if $page.data.session?.user}
    <div class="absolute bg-red-100 opacity-20 z-0 w-full top-0 pb-14"></div>   
    <p class="relative text-red-300 w-full py-4 text-center z-10 top-0">Signed in as {$page.data.session.user.email}</p>
    <div class="flex justify-center mt-4">
        <button class="rounded-full bg-red-800 py-2 px-4" on:click={handleSignOut}>Sign Out</button>
    </div>
{:else}
    <div class="absolute bg-red-100 opacity-20 z-0 w-full top-0 pb-14"></div>
    <p class="relative text-red-300 w-full py-4 text-center z-10 top-0">Not signed in.</p>
    <div class="flex justify-center mt-4">
        <button class="rounded-full bg-red-800 py-2 px-4" on:click={handleSignIn}>Sign in</button>
    </div>
{/if}