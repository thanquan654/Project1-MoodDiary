const BACKEND_URL =
	process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL

const getQuickCheckInData = async (token?: string) => {
	try {
		const response = await fetch(`${BACKEND_URL}/diaries/quick-checkin`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` }),
				'ngrok-skip-browser-warning': 'true',
			},
		})

		if (!response.ok) {
			console.error(`API call failed with status: ${response.status}`)
		}

		const data = await response.json()

		return data
	} catch (error) {
		console.error('Error get quick check-in data:', error)
		throw error
	}
}

const getCalendarData = async (
	month: number,
	year: number,
	token?: string | undefined,
) => {
	try {
		const response = await fetch(
			`${BACKEND_URL}/diaries/canlendar?year=${year}&month=${month}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					...(token && { Authorization: `Bearer ${token}` }),
					'ngrok-skip-browser-warning': 'true',
				},
			},
		)

		if (!response.ok) {
			console.error(`API call failed with status: ${response.status}`)
		}

		const data = await response.json()

		return data
	} catch (error) {
		console.error('Error get quick check-in data:', error)
		throw error
	}
}

export { getQuickCheckInData, getCalendarData }
