import EditDiaryForm from '@/app/(app)/dashboard/diary/_components/EditDiaryForm'
import { Button } from '@/components/ui/button'
import { getDiaryByIdApi } from '@/lib/apis/diaryApi'
import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'

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
	const diary = await getDiaryByIdApi(param.id, token)

	if (!diary?.data) {
		return (
			<div className="min-h-screen bg-diary-bg">
				<div className="">
					<div className="max-w-4xl mx-auto p-4 lg:p-8">
						{/* Desktop Header */}
						<div className="flex items-center gap-4 mb-6">
							<Link href={`/dashboard/diary/${param.id}`}>
								<Button
									variant="ghost"
									size="sm"
									className="p-2"
								>
									<ArrowLeft className="h-5 w-5" />
								</Button>
							</Link>
							<h1 className="text-lg lg:text-2xl font-bold text-diary-text">
								Tạo nhật ký mới
							</h1>
						</div>

						<div className="flex justify-center items-center">
							Diary Not Found
						</div>
					</div>
				</div>

				{/* Bottom padding for mobile navigation */}
				<div className="h-20 lg:hidden" />
			</div>
		)
	}

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

					<EditDiaryForm diary={diary.data} />
				</div>
			</div>

			{/* Bottom padding for mobile navigation */}
			<div className="h-20 lg:hidden" />
		</div>
	)
}
