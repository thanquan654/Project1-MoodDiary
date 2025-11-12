'use client'

import {
	getUserInfoApi,
	loginUserApi,
	logoutApi,
	registerUserApi,
} from '@/lib/apis/authApi'
import {
	isAuthenticatedAtom,
	logoutAtom,
	tokenAtom,
	isLoadingAtom,
	userAtom,
} from '@/store/userAtom'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'

export function useUser() {
	const [user, setUser] = useAtom(userAtom)
	const [token, setToken] = useAtom(tokenAtom)
	const [isLoading, setIsLoading] = useAtom(isLoadingAtom)
	const isAuthenticated = useAtomValue(isAuthenticatedAtom)
	const performLogout = useSetAtom(logoutAtom)

	useEffect(() => {
		const validateTokenAndFetchUser = async () => {
			if (token && !user) {
				try {
					const response = await getUserInfoApi(token)
					if (response.ok) {
						const userData = await response.json()
						setUser(userData)
					} else {
						performLogout()
					}
				} catch (error) {
					console.error('Failed to fetch user info:', error)
					performLogout()
				}
			}
			setIsLoading(false)
		}

		validateTokenAndFetchUser()
	}, [performLogout, setIsLoading, setUser, token, user])

	const login = async (email: string, password: string) => {
		setIsLoading(true)

		const response = await loginUserApi(email, password)
		const body = await response.json()

		if (response.ok) {
			const { user: userFromApi, token } = body
			setUser(userFromApi)
			setToken(token)
		}

		setIsLoading(false)

		return body
	}

	const register = async (name: string, email: string, password: string) => {
		setIsLoading(true)

		const response = await registerUserApi(name, email, password)

		const body = await response.json()

		if (response.ok) {
			setUser(body.user)
			setToken(body.token)
		}

		setIsLoading(false)

		return body
	}

	const logout = async () => {
		performLogout()

		if (!token) return
		await logoutApi(token)
	}

	const getUserInfo = async () => {
		if (!token) return

		const response = await getUserInfoApi(token)

		if (response.ok) {
			const body = await response.json()

			setUser(body)
		}
	}

	return {
		user,
		isAuthenticated,
		isLoading,
		login,
		register,
		logout,
		getUserInfo,
	}
}
