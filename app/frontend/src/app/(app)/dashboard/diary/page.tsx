'use client'

import { useState } from 'react'
import {
	Calendar,
	Plus,
	Search,
	Filter,
	ChevronDown,
	Trash2,
} from 'lucide-react'
import Link from 'next/link'
import Header from '@/app/(app)/_components/DashboardHeader'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function DiariesPage() {
	const [selectedFilter, setSelectedFilter] = useState('all')
	const [expandedDays, setExpandedDays] = useState<string[]>(['15/12'])
	const [deletingEntryId, setDeletingEntryId] = useState<number | null>(null)

	const diaryEntries = [
		{
			date: '15/12',
			dayName: 'Thứ Sáu',
			entries: [
				{
					id: 1,
					title: 'Buổi sáng tuyệt vời',
					time: '08:30',
					mood: 'very-happy',
					preview: 'Hôm nay thức dậy với tâm trạng rất tốt...',
				},
				{
					id: 2,
					title: 'Gặp bạn bè',
					time: '14:15',
					mood: 'happy',
					preview: 'Đi cà phê với những người bạn thân...',
				},
				{
					id: 3,
					title: 'Suy nghĩ cuối ngày',
					time: '22:00',
					mood: 'normal',
					preview: 'Nhìn lại một ngày đã qua...',
				},
			],
		},
		{
			date: '14/12',
			dayName: 'Thứ Năm',
			entries: [],
		},
		{
			date: '13/12',
			dayName: 'Thứ Tư',
			entries: [
				{
					id: 4,
					title: 'Ngày làm việc',
					time: '09:00',
					mood: 'normal',
					preview: 'Một ngày bình thường tại văn phòng...',
				},
				{
					id: 5,
					title: 'Tập thể dục',
					time: '18:30',
					mood: 'happy',
					preview: 'Cảm thấy tràn đầy năng lượng sau khi tập...',
				},
			],
		},
		{
			date: '12/12',
			dayName: 'Thứ Ba',
			entries: [
				{
					id: 6,
					title: 'Cuối tuần thư giãn',
					time: '10:00',
					mood: 'very-happy',
					preview: 'Ngủ nướng và thư giãn tại nhà...',
				},
			],
		},
	]

	const moodColors = {
		'very-happy': 'bg-emotion-very-happy',
		happy: 'bg-emotion-happy',
		normal: 'bg-emotion-normal',
		sad: 'bg-emotion-sad',
		'very-sad': 'bg-emotion-very-sad',
	}

	const toggleDay = (date: string) => {
		setExpandedDays((prev) =>
			prev.includes(date)
				? prev.filter((d) => d !== date)
				: [...prev, date],
		)
	}

	const handleDeleteEntry = (entryId: number) => {
		console.log('[v0] Deleting entry:', entryId)
		// In real app, this would call an API to delete the entry
		// For now, just close the dialog
		setDeletingEntryId(null)
	}

	return (
		<div className="min-h-screen bg-background">
			<Header />

			<main className="pb-20 lg:pb-0">
				<div className="p-4 space-y-6">
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<div className="flex-1 relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<input
									type="text"
									placeholder="Tìm kiếm nhật ký..."
									className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-diary-primary/20 focus:border-diary-primary"
								/>
							</div>
							<button className="p-3 bg-muted/50 border border-border rounded-lg hover:bg-muted transition-colors">
								<Filter className="w-4 h-4 text-muted-foreground" />
							</button>
						</div>

						<div className="flex gap-2 overflow-x-auto pb-2">
							{[
								'all',
								'very-happy',
								'happy',
								'normal',
								'sad',
								'very-sad',
							].map((filter) => (
								<button
									key={filter}
									onClick={() => setSelectedFilter(filter)}
									className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
										selectedFilter === filter
											? 'bg-diary-primary text-white'
											: 'bg-muted/50 text-muted-foreground hover:bg-muted'
									}`}
								>
									{filter === 'all'
										? 'Tất cả'
										: filter === 'very-happy'
										? 'Rất vui'
										: filter === 'happy'
										? 'Vui'
										: filter === 'normal'
										? 'Bình thường'
										: filter === 'sad'
										? 'Buồn'
										: 'Rất buồn'}
								</button>
							))}
						</div>
					</div>

					<div className="space-y-4">
						{diaryEntries.map((dayEntry) => (
							<div
								key={dayEntry.date}
								className="bg-card border border-border rounded-lg overflow-hidden"
							>
								<div
									onClick={() => toggleDay(dayEntry.date)}
									className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
								>
									<div className="flex items-center gap-3">
										<Calendar className="w-5 h-5 text-diary-primary" />
										<div>
											<h3 className="font-medium text-foreground">
												{dayEntry.dayName}
											</h3>
											<p className="text-sm text-muted-foreground">
												Ngày {dayEntry.date}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<span className="text-xs text-muted-foreground">
											{dayEntry.entries.length} nhật ký
										</span>
										<ChevronDown
											className={`w-4 h-4 text-muted-foreground transition-transform ${
												expandedDays.includes(
													dayEntry.date,
												)
													? 'rotate-180'
													: ''
											}`}
										/>
									</div>
								</div>

								{expandedDays.includes(dayEntry.date) && (
									<div className="border-t border-border">
										{dayEntry.entries.length === 0 ? (
											<div className="p-4 text-center">
												<p className="text-sm text-muted-foreground mb-3">
													Chưa có nhật ký nào
												</p>
												<Link href="/diaries/new">
													<button className="inline-flex items-center gap-2 px-4 py-2 bg-diary-primary text-white rounded-lg text-sm hover:bg-diary-primary/90 transition-colors">
														<Plus className="w-4 h-4" />
														Thêm nhật ký
													</button>
												</Link>
											</div>
										) : (
											<div className="divide-y divide-border">
												{dayEntry.entries.map(
													(entry) => (
														<div
															key={entry.id}
															className="p-4 hover:bg-muted/30 transition-colors group"
														>
															<div className="flex items-start gap-3">
																<div
																	className={`w-3 h-3 rounded-full mt-1 ${
																		moodColors[
																			entry.mood as keyof typeof moodColors
																		]
																	}`}
																/>
																<Link
																	href={`/diaries/${entry.id}`}
																	className="flex-1 min-w-0"
																>
																	<div className="flex items-center justify-between mb-1">
																		<h4 className="font-medium text-foreground text-sm">
																			{
																				entry.title
																			}
																		</h4>
																		<span className="text-xs text-muted-foreground">
																			{
																				entry.time
																			}
																		</span>
																	</div>
																	<p className="text-xs text-muted-foreground line-clamp-2">
																		{
																			entry.preview
																		}
																	</p>
																</Link>
																<AlertDialog>
																	<AlertDialogTrigger
																		asChild
																	>
																		<button
																			onClick={(
																				e,
																			) => {
																				e.stopPropagation()
																				setDeletingEntryId(
																					entry.id,
																				)
																			}}
																			className="opacity-0 group-hover:opacity-100 p-2 hover:bg-destructive/10 rounded-lg transition-all"
																			title="Xóa nhật ký"
																		>
																			<Trash2 className="w-4 h-4 text-destructive" />
																		</button>
																	</AlertDialogTrigger>
																	<AlertDialogContent>
																		<AlertDialogHeader>
																			<AlertDialogTitle>
																				Xác
																				nhận
																				xóa
																				nhật
																				ký
																			</AlertDialogTitle>
																			<AlertDialogDescription>
																				Bạn
																				có
																				chắc
																				chắn
																				muốn
																				xóa
																				nhật
																				ký
																				"
																				{
																					entry.title
																				}

																				"
																				không?
																				Hành
																				động
																				này
																				không
																				thể
																				hoàn
																				tác.
																			</AlertDialogDescription>
																		</AlertDialogHeader>
																		<AlertDialogFooter>
																			<AlertDialogCancel>
																				Hủy
																			</AlertDialogCancel>
																			<AlertDialogAction
																				onClick={() =>
																					handleDeleteEntry(
																						entry.id,
																					)
																				}
																				className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
																			>
																				Xóa
																			</AlertDialogAction>
																		</AlertDialogFooter>
																	</AlertDialogContent>
																</AlertDialog>
															</div>
														</div>
													),
												)}
											</div>
										)}
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</main>
		</div>
	)
}
