export interface Diary {
	id: number
	title: string
	content: string
	advice: string
	emotion: string
	media: {
		id: number
		mediaUrl: string
	}[]
	createdAt: string
	updatedAt: string | null
}

export interface DiaryEntryByDate {
	id: number
	title: string
	preview: string
	time: string
	emotion: string
}

export type DiaryListByDate = {
	date: string
	entries: DiaryEntryByDate[]
}[]
