<script>
	import Authorization from '../auth/+page.svelte'
</script>

<nav class="w-full shadow-lg bg-primary-700">
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

        <div class="flex gap-2 lg:gap-4 items-center shadow-lg border border-primary-600 rounded-full p-1">
            
            <a href="/food" class="hover:bg-primary-800 px-6 py-2  rounded-full hover:text-primary-300 hidden lg:block font-bold">Foods</a>
            <a href="/food" class="fa-solid fa-bowl-food hover:bg-primary-800 py-1 px-2 text-lg rounded-full hover:text-primary-300 lg:hidden"></a>

            <a href="/listings" class="hover:bg-primary-800 px-6 py-2 rounded-full hover:text-primary-300 hidden lg:block font-bold">Listings</a>
            <a href="/listings" class="fa-solid fa-house hover:bg-primary-800 py-1 px-2 mx-4 text-lg rounded-full hover:text-primary-300 lg:hidden"></a>
            <div>
                <Authorization />
            </div>
        </div>
    </ul>
</nav>