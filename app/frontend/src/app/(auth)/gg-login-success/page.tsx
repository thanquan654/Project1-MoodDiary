'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

function LoginSuccess() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	useEffect(() => {
		if (token) localStorage.setItem('user_token', token)

		router.push('/')
	}, [router, token])

	return <div>Đăng nhập thành công, đang chuyển trang ...</div>
}

export default function GoogleLoginSuccess() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<LoginSuccess />
		</Suspense>
	)
}
