<script lang="ts">
	import Authorization from './auth/+page.svelte'
	import Navigation from './navigation/+page.svelte'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { grabReservations } from './grabReservations/grabReservations'

	let introduction = "text-xs"
	let introductionBarrier = "h-0"
	let introductionImg = "w-0 h-0"
	let homeComing = "top-[-200px]"
	let foodComing = "right-[-400px]"
	let reservationComing = "top-[-200px]"

	onMount(() => {
		let userEmail = $page?.data?.session?.user?.email
		grabReservations(userEmail)
		introduction = "text-5xl"
		homeComing = "top-1/3"
		foodComing = "right-4"
		reservationComing = "top-24"
		setTimeout(() => {
			introductionBarrier = "h-64 hover-one"
			introductionImg = "w-14 h-14"
		}, 1000)
	}) 

</script>

<!-- home page which has a bunch of animated blocks that fly in and then use a hover effect -->
{#if $page.data.session?.user}
	<div class="left-4 absolute z-40 {homeComing} transition-all duration-1000 rounded-lg border border-primary-700 shadow-lg bg-primary-700 px-6 py-2 flex gap-4 items-center hover-one text-primary-50 w-72">
		<i class="fa-solid fa-home"></i>
		<p>Checkout some of the great listings near you!</p>
	</div>

	<div class="bottom-12 absolute z-40 {foodComing} transition-all duration-1000 rounded-lg border border-primary-700 shadow-lg bg-primary-700 px-6 py-2 flex gap-4 items-center hover-two text-primary-50 w-72">
		<i class="fa-solid fa-bowl-food"></i>
		<p>Need to find a restaurant while you stay? Look no further than our great curated list</p>
	</div>

	<div class="absolute z-40 right-4 {reservationComing}  transition-all duration-1000 rounded-lg border border-primary-700 shadow-lg bg-primary-700 px-6 py-2 flex gap-4 items-center hover-three text-primary-50 w-72 border-primary-800">
		<p>Already made some reservations? Check your profile settings to see your existing reservations</p>
		<i class="fa-solid fa-arrow-up"></i>
	</div>

	<div class="h-screen">
		<div class="h-1/6">
			<Navigation />
		</div>

		<div class="h-5/6 flex justify-center items-center ">
			<div class="{introductionBarrier} px-6 bg-primary-700 flex justify-center items-center rounded-lg shadow-lg transition-all duration-1000 bg-opacity-50 gap-4">
				<img src="../../../portfolio_logo_white.png" class=" transition-all duration-1000 p-1 bg-primary-900 rounded-lg {introductionImg}" alt="logo with the words AK"/>
				<p class="{introduction} transition-all duration-1000 text-primary-900 font-bold text-center w-full">Welcome to my fullstack App</p>
				
			</div>
		</div>
	</div>
{:else}
	<Authorization />
{/if}


<style>
	.hover-one {
        animation: hover-one 3s infinite;
    }

	.hover-two {
        animation: hover-two 4s infinite;
    }

	.hover-three {
        animation: hover-three 2s infinite;
    }

	@keyframes hover-one {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }

	@keyframes hover-two {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }

	@keyframes hover-three {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-5px);
        }
    }

	.welcomeText {
		font-size: 1px;
	}
</style>