<script>
	import Authorization from '../auth/+page.svelte'
</script>

<nav class="w-full shadow-lg bg-primary-900">
    <ul class="p-4 flex justify-between items-center">
        <li class="flex">
            <a href="/">
                <img src="../../../portfolio_logo_white.png" class="w-10 rounded-lg p-1 hover:bg-primary-800 lg:hidden" alt="logo with the words AK"/>
            </a>
            <div class="hidden lg:block">
                <a href="/" class="flex items-center hover:text-primary-300">
                    <div>
                        <img src="../../../portfolio_logo_white.png" class="w-10 p-1" alt="logo with the words AK"/>
                    </div>
                    <div>
                        <i class=" font-bold">Andrew Kester</i>
                    </div>
                </a>
            </div>
        </li>

        <div class="flex gap-2 lg:gap-4 items-center shadow-lg border border-primary-700 rounded-full p-1">
            <!-- <li class="flex gap-4 items-center hover:bg-primary-800 px-6 py-2 rounded-lg hover:text-primary-300">
                <a href="/movies" class="">Movies</a>
            </li> -->
            <a href="/food" class="hover:bg-primary-800 px-6 py-2  rounded-r-lg rounded-l-full hover:text-primary-300 hidden lg:block">Foods</a>
            <a href="/food" class="fa-solid fa-bowl-food hover:bg-primary-800 py-1 px-2 text-lg rounded-r-lg rounded-l-full hover:text-primary-300 lg:hidden"></a>

            <a href="/listings" class="hover:bg-primary-800 px-6 py-2 rounded-lg hover:text-primary-300 hidden lg:block">Listings</a>
            <a href="/listings" class="fa-solid fa-house hover:bg-primary-800 py-1 px-2 mx-4 text-lg rounded-lg hover:text-primary-300 lg:hidden"></a>
            <div>
                <Authorization />
            </div>
        </div>
    </ul>
</nav>