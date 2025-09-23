'use client'

import { loginUserApi, registerUserApi } from '@/lib/apis/authApi'
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

		console.log('🚀 ~ response:', response)

		if (response.ok) {
			const body = await response.json()

			console.log('🚀 ~ body:', body)

			setUser(body.user)
			setToken(body.token)
			setAuthenticated(true)
		}

		return response
	}

	const register = async (name: string, email: string, password: string) => {
		const response = await registerUserApi(name, email, password)

		if (response.ok) {
			const body = await response.json()

			setUser(body.user)
			setToken(body.token)
			setAuthenticated(true)
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
