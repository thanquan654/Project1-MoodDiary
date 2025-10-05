export class ApiError extends Error {
	constructor(public status: number, message: string, public data?: unknown) {
		super(message)
		this.name = 'ApiError'
	}
}

export async function handleResponse(response: Response) {
	const data = await response.json()

	if (!response.ok) {
		throw new ApiError(
			response.status,
			data.message || 'Something went wrong',
			data,
		)
	}

	return data
}

export function getAuthorizationHeader() {
	if (typeof window === 'undefined') {
		return undefined
	}

	const token = localStorage.getItem('user_token')
	return token ? `Bearer ${token}` : undefined
}
