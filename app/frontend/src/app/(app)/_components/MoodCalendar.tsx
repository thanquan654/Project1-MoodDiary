'use client'

import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import { format } from 'date-fns'
import './MoodCalendar.css'
import { ChevronLeft, ChevronRight, SquircleDashed } from 'lucide-react'
import { useCalendar } from '@/hooks/useCalendar'
import { useRouter } from 'next/navigation'
import { getCalendarData } from '@/lib/apis/dashboard'

const emotionIconMap: { [key: string]: string } = {
	Vui: '😄',
	'Lo lắng': '😑',
	Buồn: '😢',
	'Tức giận': '😡',
	'Trung tính': '😐',
	'Không thể xác định cảm xúc. Vui lòng viết thêm chi tiết.': '😵‍💫',
}

type ValuePiece = Date | null

type Value = ValuePiece | [ValuePiece, ValuePiece]

type Props = {
	calendarData: {
		date: string
		emotion: string
	}[]
}

function MoodCalendar({ calendarData }: Props) {
	const router = useRouter()
	const token = localStorage.getItem('user_token')
	const [date, setDate] = useState<Value>(new Date())
	const { calendar, setCalendarFormData } = useCalendar()

	useEffect(() => {
		setCalendarFormData(calendarData)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [calendarData])

	// Handler
	const handleClickDate = (value: Date) => {
		const chooseDate = format(value, 'yyyy-MM-dd')

		router.push(
			`/dashboard/diary?fromDate=${chooseDate}&toDate=${chooseDate}`,
		)
	}

	const handleChangeMonth = async ({
		activeStartDate,
		view,
	}: {
		activeStartDate: Date | null
		view: string
	}) => {
		if (view === 'month' && activeStartDate) {
			const newCalendarData =
				(
					await getCalendarData(
						activeStartDate.getMonth() + 1,
						activeStartDate.getFullYear(),
						token?.replaceAll('"', '') || undefined,
					)
				)?.data || []
			setCalendarFormData(newCalendarData)
		}
	}

	const renderTileContent = ({
		date,
		view,
	}: {
		date: Date
		view: string
	}) => {
		if (view === 'month') {
			const dateString = format(date, 'yyyy-MM-dd')

			const mood = calendar[dateString]

			if (mood) {
				return (
					<div className="mood-icon-wrapper text-diary-text-light dark:text-diary-text-dark w-4 h-4">
						<span className="text-3xl">{emotionIconMap[mood]}</span>
						<span>{date.getDate()}</span>
					</div>
				)
			}

			return (
				<div className="mood-icon-wrapper text-diary-text-light dark:text-diary-text-dark">
					<span>
						<SquircleDashed className="text-gray-300 font-extralight w-4 h-4" />
						{date.getDate()}
					</span>
				</div>
			)
		}
	}

	return (
		<div className="calendar-container ">
			<Calendar
				onChange={setDate}
				value={date}
				tileContent={renderTileContent}
				defaultView="month"
				locale="vi-VN"
				minDetail="year"
				nextLabel={<ChevronRight />}
				prevLabel={<ChevronLeft />}
				onClickDay={handleClickDate}
				onActiveStartDateChange={handleChangeMonth}
			/>
		</div>
	)
}

export default MoodCalendar
