'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function GoogleLoginSuccess() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	useEffect(() => {
		if (token) localStorage.setItem('user-token', token)

		router.push('/')
	}, [router, token])

	return <div>Đăng nhập thành công, đang chuyển trang ...</div>
}
