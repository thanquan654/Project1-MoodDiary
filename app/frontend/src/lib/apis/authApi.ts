const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

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

const registerUserApi = async (
	name: string,
	email: string,
	password: string,
) => {
	const response = await fetch(`${BASE_URL}/auth/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ fullName: name, email, password }),
	})
	return response
}

const loginWithGoogleApi = async () => {
	const response = await fetch(`${BASE_URL}/auth/login/google`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})
	return response
}

export { loginUserApi, registerUserApi, loginWithGoogleApi }
