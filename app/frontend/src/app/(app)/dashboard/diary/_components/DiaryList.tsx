'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, ChevronDown, BookPlus } from 'lucide-react'
import { type DiaryListByDate } from '../_types/diary.type'

const emotionIconMap: { [key: string]: string } = {
	happy: '😊',
	anxious: '😑',
	sad: '😢',
	angry: '😡',
	neutral: '😐',
}

interface DiaryListProps {
	initialData: DiaryListByDate
}

export default function DiaryList({ initialData }: DiaryListProps) {
	const [expandedDays, setExpandedDays] = useState<string[]>(['15/12'])
	const [diaryList] = useState<DiaryListByDate>(initialData)

	const toggleDay = (date: string) => {
		setExpandedDays((prev) =>
			prev.includes(date)
				? prev.filter((d) => d !== date)
				: [...prev, date],
		)
	}

	return (
		<div className="mt-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-lg lg:text-2xl font-bold text-diary-text">
					Danh sách nhật ký
				</h1>

				<Link href={'/dashboard/diary/new'}>
					<Button className="bg-diary-primary hover:bg-diary-primary/90 text-diary-text-dark">
						<BookPlus className="mr-2" />
						Tạo nhật ký
					</Button>
				</Link>
			</div>

			<div className="space-y-4">
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
								<span className="font-medium">
									{dayEntry.date}
								</span>
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
														entry.emotion.toLowerCase()
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
														{entry.content.substring(
															0,
															100,
														)}
														{entry.content.length >
														100
															? '...'
															: ''}
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
		</div>
	)
}
