import { writable } from 'svelte/store';

// modal with one button
export const notificationsModal = writable(false)

// modal with two buttons
export const notificationsModalTwo = writable(false)

// modal custom title
export const notificationsTitle = writable("")

// modal custom message
export const notificationsMessage = writable("")

// modal types
export const notificationsWarning = writable(false)
export const notificationsReviews = writable(false)
export const notificationsReservations = writable(false)

// stores the reservations the user makes 
export const reservations = writable([])