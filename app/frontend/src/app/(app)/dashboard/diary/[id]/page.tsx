import { Suspense, use } from 'react'
import { cookies } from 'next/headers'
import { getDiaryByIdApi } from '@/lib/apis/diaryApi'
import DiaryDetailClient from './_components/DiaryDetailClient'
import { Metadata } from 'next'
import DiaryDetailLoading from '@/app/(app)/dashboard/diary/[id]/loading'

interface Props {
	params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const param = await params

	const cookieStore = cookies()
	const token = (await cookieStore).get('auth_token')?.value
	const diary = await getDiaryByIdApi(param.id, token)

	return {
		title: `${diary.data.title} - Smart Diary`,
		description: diary.data.content.substring(0, 160),
	}
}

export default async function DiaryDetailPage({ params }: Props) {
	const param = await params

	const cookieStore = cookies()
	const token = (await cookieStore).get('auth_token')?.value
	const diary = await getDiaryByIdApi(param.id, token)

	return (
		<div className="min-h-screen bg-background p-4">
			<Suspense fallback={<DiaryDetailLoading />}>
				<DiaryDetailClient initialData={diary.data} params={param} />
			</Suspense>
		</div>
	)
}
