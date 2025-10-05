import { getDiarysListApi } from '@/lib/apis/diaryApi'
import Header from '@/app/(app)/_components/DashboardHeader'
import { transformDiaryDataList } from '@/helpers/transformDiaryData'
import { cookies } from 'next/headers'
import DiaryList from '@/app/(app)/dashboard/diary/_components/DiaryList'
import SearchSection from './_components/SearchSection'

export const dynamic = 'force-dynamic'

interface DiariesPageProps {
	searchParams: {
		keyword?: string
		startDate?: string
		endDate?: string
		emotion?: string
	}
}

export default async function DiariesPage({ searchParams }: DiariesPageProps) {
	const cookieStore = cookies()
	const token = (await cookieStore).get('auth_token')?.value

	const filters = await searchParams

	const response = await getDiarysListApi(filters, token)

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
