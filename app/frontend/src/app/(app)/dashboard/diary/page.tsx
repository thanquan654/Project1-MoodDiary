import { getDiarysListApi } from '@/lib/apis/diaryApi'
import Header from '@/app/(app)/_components/DashboardHeader'
import { transformDiaryDataList } from '@/helpers/transformDiaryData'
import { cookies } from 'next/headers'
import DiaryList from '@/app/(app)/dashboard/diary/_components/DiaryList'
import SearchSection from './_components/SearchSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Danh sách nhật ký - Smart Diary',
	description: 'Nhật ký cảm xúc của bạn',
}

export const dynamic = 'force-dynamic'

interface DiariesPageProps {
	searchParams: Promise<{
		keyword?: string
		startDate?: string
		endDate?: string
		emotion?: string
	}>
}

export default async function DiariesPage({ searchParams }: DiariesPageProps) {
	const cookieStore = cookies()
	const token = (await cookieStore).get('auth_token')?.value

	const filters = await searchParams

	const response = await getDiarysListApi(filters, token)

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	const diaryList = transformDiaryDataList(response?.data)

	return (
		<div className="min-h-screen bg-background">
			<Header />

			<main className="pb-20 lg:pb-0">
				<div className="p-4 space-y-6">
					<SearchSection />
					<DiaryList initialData={diaryList} />
				</div>
			</main>
		</div>
	)
}
