import DashboardHeader from '@/app/(app)/_components/DashboardHeader'
import MoodCalendar from '@/app/(app)/_components/MoodCalendar'
import { MoodSelector } from '@/app/(app)/_components/MoodSelector'
import { QuickQuestion } from '@/app/(app)/_components/QuickQuestion'
import { getCalendarData, getQuickCheckInData } from '@/lib/apis/dashboard'
import { cookies } from 'next/headers'
import React from 'react'

export const metadata = {
	title: 'MoodDiary - Dashboard',
	description: 'MoodDiary: Nhật ký cảm xúc thông minh',
}

const isNowAfter8PM = () => {
	const formatter = new Intl.DateTimeFormat('en-US', {
		timeZone: 'Asia/Ho_Chi_Minh',
		hour: '2-digit',
		hour12: false,
	})
	const date = formatter.format(new Date())
	const hour = parseInt(date, 10)

	return hour >= 20
}

export default async function Dashboard() {
	const cookieStore = cookies()
	const date = new Date()
	const token = (await cookieStore).get('auth_token')?.value
	const checkInData = await getQuickCheckInData(token)
	const calendarData =
		(await getCalendarData(date.getMonth() + 1, date.getFullYear(), token))
			?.data || []

	return (
		<div className="min-h-screen bg-background">
			<div className="">
				<DashboardHeader />
			</div>

			<main className="px-4 pb-20 lg:pb-6 pt-4 lg:px-8 lg:py-8">
				{!checkInData.data.hasRecordedToday && isNowAfter8PM() && (
					<div className="flex flex-col md:flex-row gap-2">
						<div className="flex-1 mb-6 lg:mb-8 ">
							<MoodSelector />
						</div>

						<div className="flex-1 mb-6 lg:mb-8">
							<QuickQuestion
								question={checkInData.data.todayQuestion}
							/>
						</div>
					</div>
				)}

				<div>
					<MoodCalendar calendarData={calendarData} />
				</div>
			</main>
		</div>
	)
}
