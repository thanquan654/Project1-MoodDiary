'use client'

import { loginUserApi, registerUserApi } from '@/lib/apis/authApi'
import {
	isAuthenticatedAtom,
	logoutAtom,
	tokenAtom,
	userAtom,
} from '@/store/userAtom'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'

export function useUser() {
	const [user, setUser] = useAtom(userAtom)
	const [token, setToken] = useAtom(tokenAtom)
	const isAuthenticated = useAtomValue(isAuthenticatedAtom)
	const performLogout = useSetAtom(logoutAtom)

	const login = async (email: string, password: string) => {
		const response = await loginUserApi(email, password)

		if (response.ok) {
			const body = await response.json()

			const { user: userFromApi, token } = body

			setUser(userFromApi)
			setToken(token)
		}

		return response
	}

	const register = async (name: string, email: string, password: string) => {
		const response = await registerUserApi(name, email, password)

		if (response.ok) {
			const body = await response.json()

			setUser(body.user)
			setToken(body.token)
		}
	}

	const logout = () => {
		performLogout()
	}

	return {
		user,
		isAuthenticated,
		login,
		register,
		logout,
	}
}
