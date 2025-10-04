// components/AuthGuard.tsx
'use client'

import { useUser } from '@/hooks/useUser' // Đường dẫn tới hook của bạn
import { useRouter } from 'next/navigation' // Dùng 'next/navigation' trong App Router
import { useEffect } from 'react'

// Component Spinner đơn giản
const FullPageSpinner = () => (
	<div
		style={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			height: '100vh',
		}}
	>
		<div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
	</div>
)

export function AuthGuard({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useUser()
	const router = useRouter()

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push('/')
		}
	}, [isLoading, isAuthenticated, router])

	if (isLoading) {
		return <FullPageSpinner />
	}

	if (isAuthenticated) {
		return <>{children}</>
	}

	return <FullPageSpinner />
}
