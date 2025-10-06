import Link from 'next/link'
import React from 'react'

export const metadata = {
	title: 'MoodDiary - Dashboard',
	description: 'MoodDiary: Nhật ký cảm xúc thông minh',
}

export default function Dashboard() {
	return (
		<div>
			<div>Dashboard Page</div>
			<Link href="/">Home</Link>
		</div>
	)
}
