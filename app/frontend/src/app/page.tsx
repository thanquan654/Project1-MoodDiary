import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
	const cookieStore = cookies()
	const token = cookieStore.get('user_token')

	if (token) {
		redirect('/dashboard')
	}

	return (
		<div className="flex flex-col items-center justify-center h-screen space-y-4">
			<h1 className="text-2xl font-bold">MoodDiary</h1>
			<p className="text-center text-muted-foreground">
				Chào mừng đến với nhật ký cảm xúc thông minh
			</p>

			<div className="p-4 border rounded-md text-center">
				<p className="mb-4">Bạn cần đăng nhập để sử dụng ứng dụng</p>
				<Button asChild>
					<Link href="/login">Đăng nhập ngay</Link>
				</Button>
			</div>
		</div>
	)
}
