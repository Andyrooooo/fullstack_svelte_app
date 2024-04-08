import { reservations } from '../../../src//routes/airbnb/airbnbStore'

export async function grabReservations(userEmail: string) {
    try {
        const response = await fetch('./grabReservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: userEmail})
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json()
        reservations.set(data)

    } catch (error) {
        console.error('Failed to fetch reservations:', error)
    }
}