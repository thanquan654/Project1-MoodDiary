'use client'

import React, { useState } from 'react'
import Calendar from 'react-calendar'
import { format } from 'date-fns'
import './MoodCalendar.css'
import {
	Angry,
	ChevronLeft,
	ChevronRight,
	Frown,
	Laugh,
	Meh,
	SquircleDashed,
	Star,
} from 'lucide-react'

const moodIcons = {
	happy: <Laugh />,
	normal: <Meh />,
	sad: <Frown />,
	angry: <Angry />,
	playful: <Star />,
}

// Dữ liệu cảm xúc của người dùng (ví dụ)
const userMoodData = {
	'2025-09-01': 'happy',
	'2025-09-02': 'happy',
	'2025-09-03': 'playful',
	'2025-09-04': 'happy',
	'2025-09-05': 'playful',
	'2025-09-06': 'sad',
}

type ValuePiece = Date | null

type Value = ValuePiece | [ValuePiece, ValuePiece]

function MoodCalendar() {
	const [date, setDate] = useState<Value>(new Date())

	const renderTileContent = ({
		date,
		view,
	}: {
		date: Date
		view: string
	}) => {
		// Chỉ áp dụng cho chế độ xem tháng (month view)
		if (view === 'month') {
			// Định dạng ngày thành 'YYYY-MM-DD' để khớp với key trong dữ liệu
			const dateString = format(date, 'yyyy-MM-dd')

			// Lấy cảm xúc của ngày đó từ dữ liệu
			const mood = userMoodData[dateString]

			// Nếu có cảm xúc cho ngày này, trả về icon tương ứng
			if (mood) {
				return (
					<div className="mood-icon-wrapper text-diary-text-light dark:text-diary-text-dark w-4 h-4">
						{moodIcons[mood]}
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
			/>
		</div>
	)
}

export default MoodCalendar
