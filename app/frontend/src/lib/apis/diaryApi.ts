/* eslint-disable @typescript-eslint/no-unused-vars */
const BACKEND_URL = process.env.BACKEND_URL

const getDiarysListApi = async (
	searchParams?: {
		keyword?: string
		startDate?: string
		endDate?: string
		emotion?: string
	},
	token?: string,
) => {
	try {
		const cleanedParams = Object.fromEntries(
			Object.entries(searchParams || {}).filter(
				([_, v]) => v != null && v !== '',
			),
		)
		const query = new URLSearchParams(cleanedParams).toString()

		const url = `${BACKEND_URL}/diaries?${query}`

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` }),
				'ngrok-skip-browser-warning': 'true',
			},
			cache: 'no-store',
		})

		if (!response.ok) {
			throw new Error(`API call failed with status: ${response.status}`)
		}

		const data = await response.json()

		return data
	} catch (error) {
		console.error('Error in getDiarysListApi:', error)
		throw error
	}
}

const getDiaryByIdApi = async (id: string, token?: string) => {
	try {
		const url = `${BACKEND_URL}/diaries/${id}`
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` }),
				'ngrok-skip-browser-warning': 'true',
			},
			cache: 'no-store',
		})

		if (!response.ok) {
			throw new Error(`API call failed with status: ${response.status}`)
		}

		const data = await response.json()
		return data
	} catch (error) {
		console.error(`Error getting diary by id ${id}:`, error)
		throw error
	}
}

const deleteDiaryApi = async (id: number, token?: string) => {
	try {
		const url = `${BACKEND_URL}/diaries/${id}`

		const response = await fetch(url, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` }),
				'ngrok-skip-browser-warning': 'true',
			},
		})

		if (!response.ok) {
			throw new Error(`API call failed with status: ${response.status}`)
		}

		const data = await response.json()
		return data
	} catch (error) {
		console.error(`Error deleting diary ${id}:`, error)
		throw error
	}
}

export { getDiarysListApi, getDiaryByIdApi, deleteDiaryApi }
