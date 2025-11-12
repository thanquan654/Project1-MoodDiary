'use client'

import { addCookieApi } from '@/lib/apis/authApi'
import { tokenAtom } from '@/store/userAtom'
import { useSetAtom } from 'jotai'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

function LoginSuccess() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	console.log('🚀 ~ token:', token)

	const setToken = useSetAtom(tokenAtom)

	useEffect(() => {
		async function redirect() {
			if (token) {
				await addCookieApi(token)
				localStorage.setItem('auth_token', token)
				setToken(token)
			}

			router.push('/dashboard')
		}
		redirect()
	}, [router, setToken, token])

	return <div>Đăng nhập thành công, đang chuyển trang ...</div>
}

export default function GoogleLoginSuccessPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<LoginSuccess />
		</Suspense>
	)
}
