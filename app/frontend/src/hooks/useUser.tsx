import { loginUserApi } from '@/lib/apis/authApi'
import {
	isAuthenticatedAtom,
	logoutAtom,
	tokenAtom,
	userAtom,
} from '@/store/userAtom'
import { useAtom, useSetAtom } from 'jotai'

export function useUser() {
	const [user, setUser] = useAtom(userAtom)
	const setToken = useSetAtom(tokenAtom)
	const [isAuthenticated, setAuthenticated] = useAtom(isAuthenticatedAtom)
	const performLogout = useSetAtom(logoutAtom)

	const login = async (email: string, password: string) => {
		const response = await loginUserApi(email, password)

		if (response.ok) {
			const body = await response.json()
			setUser(body.user)
			setToken(body.token)
			setAuthenticated(true)
		}

		return response

		// FIXME: This is mock data
		// const responeBody = {
		// 	user: {
		// 		id: 1,
		// 		name: email,
		// 		email: password,
		// 	},
		// 	token: 'saashdihasdhsahdiashda',
		// }

		// setUser(responeBody.user)
		// setToken(responeBody.token)
		// setAuthenticated(true)

		// return responeBody
	}

	const logout = () => {
		performLogout()
	}

	return {
		user,
		isAuthenticated,
		login,
		logout,
	}
}
