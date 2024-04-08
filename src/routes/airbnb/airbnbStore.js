import { writable } from 'svelte/store';

export const notificationsModal = writable(false)
export const notificationsModalTwo = writable(false)
export const notificationsTitle = writable("")
export const notificationsMessage = writable("")
export const reservations = writable([])