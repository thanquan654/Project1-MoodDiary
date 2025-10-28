'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, ChevronDown, BookPlus } from 'lucide-react'
import { type DiaryListByDate } from '../_types/diary.type'

const emotionIconMap: { [key: string]: string } = {
	Vui: '😄',
	'Lo lắng': '😑',
	Buồn: '😢',
	'Tức giận': '😡',
	'Trung tính': '😐',
	'Không thể xác định cảm xúc. Vui lòng viết thêm chi tiết.': '😵‍💫',
}

interface DiaryListProps {
	initialData: DiaryListByDate
}

export default function DiaryList({ initialData }: DiaryListProps) {
	const [expandedDays, setExpandedDays] = useState<string[]>([])

	const diaryList = initialData

	const toggleDay = (date: string) => {
		setExpandedDays((prev) =>
			prev.includes(date)
				? prev.filter((d) => d !== date)
				: [...prev, date],
		)
	}

	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<Link href="/dashboard/diary/new">
					<Button className="bg-diary-primary hover:bg-diary-primary/90 text-diary-text-dark">
						<BookPlus className="mr-2" />
						<span>Thêm nhật ký mới</span>
					</Button>
				</Link>
			</div>

			{diaryList.length === 0 && (
				<div className="text-muted-foreground mt-10 text-center">
					Bạn chưa có nhật ký nào, hãy viết ra những suy nghĩ của bạn
				</div>
			)}

			{/* Dùng diaryList trực tiếp */}
			{diaryList.map((dayEntry) => (
				<div
					key={dayEntry.date}
					className="bg-card text-card-foreground border border-border rounded-lg overflow-hidden"
				>
					{/* Date Header */}
					<button
						className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
						onClick={() => toggleDay(dayEntry.date)}
					>
						<div className="flex items-center gap-3">
							<Calendar className="w-5 h-5 text-diary-primary" />
							<span className="font-medium">{dayEntry.date}</span>
							<span className="text-sm text-muted-foreground">
								{dayEntry.entries.length} bài viết
							</span>
						</div>

						<ChevronDown
							className={`w-5 h-5 text-muted-foreground transform transition-transform ${
								expandedDays.includes(dayEntry.date)
									? 'rotate-180'
									: ''
							}`}
						/>
					</button>

					{/* Entries */}
					{expandedDays.includes(dayEntry.date) && (
						<div className="divide-y divide-border">
							{dayEntry.entries.map((entry) => (
								<div
									key={entry.id}
									className="p-4 hover:bg-muted/50 transition-colors"
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<span className="text-xl">
												{emotionIconMap[
													entry.emotion
												] || '😐'}
											</span>
											<Link
												href={`/dashboard/diary/${entry.id}`}
												className="hover:text-primary transition-colors"
											>
												<h3 className="font-medium">
													{entry.title}
												</h3>
												<p className="text-sm text-muted-foreground">
													{entry.preview}
												</p>
											</Link>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			))}
		</div>
	)
}
