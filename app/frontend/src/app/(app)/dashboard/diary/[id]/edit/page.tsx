import EditDiaryForm from '@/app/(app)/dashboard/diary/_components/EditDiaryForm'
import { Button } from '@/components/ui/button'
import { getDiaryByIdApi } from '@/lib/apis/diaryApi'
import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'

// FIXME: Mock data
// Mock data - in real app this would come from API
const mockDiaryEntry = {
	id: '1',
	title: 'Ngày đẹp trời',
	content: `Hôm nay là một ngày thật tuyệt vời! Tôi đã dậy sớm và đi dạo trong công viên gần nhà. Không khí trong lành, tiếng chim hót véo von làm tôi cảm thấy thật thư giãn và hạnh phúc.

Buổi chiều tôi gặp gỡ bạn bè tại quán cà phê quen thuộc. Chúng tôi trò chuyện rất vui vẻ về những kế hoạch sắp tới. Cảm giác được chia sẻ và lắng nghe những câu chuyện của nhau thật ý nghĩa.`,
	mood: 'very-happy',
	images: [
		{ id: 1, url: 'https://picsum.photos/200/300' },
		{ id: 2, url: 'https://picsum.photos/200/300' },
		{ id: 3, url: 'https://picsum.photos/200/300' },
	],
}

export const metadata: Metadata = {
	title: 'Sửa nhật ký - Smart Diary',
	description: 'Sửa nhật ký',
}

type PageProps = {
	params: Promise<{ id: string }>
}

export default async function EditDiaryPage({ params }: PageProps) {
	const param = await params

	const cookieStore = cookies()
	const token = (await cookieStore).get('auth_token')?.value
	// const diary = await getDiaryByIdApi(param.id, token)

	// console.log('🚀 ~ diary:', diary)

	return (
		<div className="min-h-screen bg-diary-bg">
			<div className="">
				<div className="max-w-4xl mx-auto p-4 lg:p-8">
					{/* Desktop Header */}
					<div className="flex items-center gap-4 mb-6">
						<Link href={`/dashboard/diary/${param.id}`}>
							<Button variant="ghost" size="sm" className="p-2">
								<ArrowLeft className="h-5 w-5" />
							</Button>
						</Link>
						<h1 className="text-lg lg:text-2xl font-bold text-diary-text">
							Tạo nhật ký mới
						</h1>
					</div>

					<EditDiaryForm diary={mockDiaryEntry} />
				</div>
			</div>

			{/* Bottom padding for mobile navigation */}
			<div className="h-20 lg:hidden" />
		</div>
	)
}
