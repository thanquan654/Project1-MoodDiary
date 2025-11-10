'use client'

import { useState } from 'react'

export function useCalendar() {
	const [calendar, setCalendar] = useState<{ [key: string]: string }>({})

	const setCalendarFormData = (
		calendarData: { date: string; emotion: string }[],
	) => {
		const newCalendar: { [key: string]: string } = calendarData.reduce(
			(acc: { [key: string]: string }, data) => {
				acc[data.date] = data.emotion
				return acc
			},
			{},
		)

		setCalendar({ ...calendar, ...newCalendar })
	}

	return {
		calendar,
		setCalendarFormData,
	}
}
