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

		const url = query
			? `${BACKEND_URL}/diaries/search?${query}`
			: `${BACKEND_URL}/diaries`

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
			console.error(`API call failed with status: ${response.status}`)
			const data = await response.json()

			return {
				message: `API call failed with status: ${response.status}`,
				data: [],
			}
		}

		const data = await response.json()

		return data
	} catch (error) {
		console.error('Error in getDiarysListApi:', error)
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
			console.error(`API call failed with status: ${response.status}`)
		}

		const data = await response.json()
		return data
	} catch (error) {
		console.error(`Error getting diary by id ${id}:`, error)
		throw error
	}
}

const createDiaryApi = async (formData: FormData) => {
	try {
		const response = await fetch('/api/diary', {
			method: 'POST',
			body: formData,
		})

		if (!response.ok) {
			console.error(`API call failed with status: ${response.status}`)
		}

		const data = await response.json()

		return data
	} catch (error) {
		console.error('Error creating diary:', error)
		throw error
	}
}

const editDiaryApi = async (id: number, formData: FormData) => {
	try {
		const response = await fetch(`/api/diary/${id}`, {
			method: 'PUT',
			body: formData,
		})

		if (!response.ok) {
			console.error(`API call failed with status: ${response.status}`)
		}

		const data = await response.json()

		return data
	} catch (error) {
		console.error(`Error editing diary ${id}:`, error)
		return
	}
}

const deleteDiaryApi = async (id: number) => {
	try {
		const response = await fetch(`/api/diary/${id}`, {
			method: 'DELETE',
		})

		if (!response.ok) {
			console.error(`API call failed with status: ${response.status}`)
		}

		const data = await response.json()
		return data
	} catch (error) {
		console.error(`Error deleting diary ${id}:`, error)
		throw error
	}
}

export {
	getDiarysListApi,
	getDiaryByIdApi,
	createDiaryApi,
	editDiaryApi,
	deleteDiaryApi,
}
