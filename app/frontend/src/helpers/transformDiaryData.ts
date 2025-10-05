type Diary = {
	id: number
	title: string
	content: string
	advice: string
	emotion: string
	media?: {
		id: number
		mediaUrl: string
	}[]
	createdAt: string
	updatedAt: string
}

type Entry = {
	id: number
	title: string
	time: string
	emotion: string
	preview: string
}

export type DiaryListByDate = {
	date: string
	dayName: string
	entries: Entry[]
}[]

const emotionToMoodMap: { [key: string]: string } = {
	'Vui vẻ': 'happy',
	'Lo lắng': 'anxious',
	Buồn: 'sad',
	'Tức giận': 'angry',
	'Trung tính': 'neutral',
}

const vietnameseDays = [
	'Chủ Nhật',
	'Thứ Hai',
	'Thứ Ba',
	'Thứ Tư',
	'Thứ Năm',
	'Thứ Sáu',
	'Thứ Bảy',
]

const padZero = (num: string | number) => String(num).padStart(2, '0')

/**
 * Biến đổi mảng nhật ký thành mảng được nhóm theo ngày.
 * @param {Array<Object>} diaries - Mảng các đối tượng nhật ký.
 * @returns {Array<Object>} Mảng đã được nhóm và định dạng lại.
 */
export function transformDiaryDataList(diaries: Diary[]): DiaryListByDate {
	const groupedByDate = diaries.reduce<Record<string, Entry[]>>(
		(acc, diary) => {
			const createdAtDate = new Date(diary.createdAt)
			const dateKey = createdAtDate.toISOString().slice(0, 10)

			if (!acc[dateKey]) {
				acc[dateKey] = []
			}

			const entry: Entry = {
				id: diary.id,
				title: diary.title,
				time: `${padZero(createdAtDate.getHours())}:${padZero(
					createdAtDate.getMinutes(),
				)}`,
				emotion: emotionToMoodMap[diary.emotion] || 'neutral',
				preview:
					diary.content.substring(0, 100) +
					(diary.content.length > 100 ? '...' : ''),
			}

			acc[dateKey].push(entry)
			return acc
		},
		{},
	)

	const sortedDates = Object.keys(groupedByDate).sort(
		(a, b) => new Date(b).getTime() - new Date(a).getTime(),
	)

	const result = sortedDates.map((dateKey) => {
		const dateObj = new Date(dateKey)
		const entries = groupedByDate[dateKey]

		return {
			date: `${padZero(dateObj.getDate())}/${padZero(
				dateObj.getMonth() + 1,
			)}/${dateObj.getFullYear()}`,
			dayName: vietnameseDays[dateObj.getDay()],
			entries: entries,
		}
	})

	return result
}
