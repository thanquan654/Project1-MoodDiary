'use client'

import { useCallback, useState } from 'react'

export function useCalendar() {
	const [calendar, setCalendar] = useState<{ [key: string]: string }>({})

	const setCalendarFormData = useCallback(
		(calendarData: { date: string; emotion: string }[]) => {
			const newCalendar = Object.fromEntries(
				calendarData.map((data) => [data.date, data.emotion]),
			)

			setCalendar((prevCalendar) => ({ ...prevCalendar, ...newCalendar }))
		},
		[],
	)

	return {
		calendar,
		setCalendarFormData,
	}
}
