const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

console.log('🚀 ~ BASE_URL:', BASE_URL)

const loginUserApi = async (email: string, password: string) => {
	const response = await fetch(`${BASE_URL}/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password }),
	})
	return response
}

export { loginUserApi }
