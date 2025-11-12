import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import LoginForm from '@/app/(auth)/_components/LoginForm'

export const metadata: Metadata = {
	title: 'Đăng nhập - Smart Diary',
	description: 'Đăng nhập vào Smart Diary để ghi lại cảm xúc của bạn',
}

export default async function LoginPage() {
	const cookieStore = cookies()
	const token = (await cookieStore).get('user_token')?.value

	if (token) {
		redirect('/dashboard')
	}

	return (
		<div className="min-h-screen bg-diary-bg-light dark:bg-diary-bg-dark flex items-center justify-center p-4">
			<LoginForm />
		</div>
	)
}
