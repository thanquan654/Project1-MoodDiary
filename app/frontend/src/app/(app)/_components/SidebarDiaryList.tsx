import { Calendar, ChevronDown, ChevronRight } from 'lucide-react'
import React, { useState } from 'react'

export default function SideBarDiaryList() {
	const [expandedDays, setExpandedDays] = useState<string[]>(['15/12'])
	const diaryEntries = [
		{
			date: '15/12/2025',
			hasEntry: true,
			entries: [
				{ id: 1, title: 'Buổi sáng tuyệt vời', time: '08:30' },
				{ id: 2, title: 'Gặp bạn bè', time: '14:15' },
				{ id: 3, title: 'Suy nghĩ cuối ngày', time: '22:00' },
			],
		},
		{
			date: '14/12',
			hasEntry: false,
			entries: [],
		},
		{
			date: '13/12',
			hasEntry: true,
			entries: [
				{ id: 4, title: 'Ngày làm việc', time: '09:00' },
				{ id: 5, title: 'Tập thể dục', time: '18:30' },
			],
		},
		{
			date: '12/12',
			hasEntry: true,
			entries: [{ id: 6, title: 'Cuối tuần thư giãn', time: '10:00' }],
		},
		{
			date: '11/12',
			hasEntry: false,
			entries: [],
		},
		{
			date: '10/12',
			hasEntry: true,
			entries: [
				{ id: 7, title: 'Ngày mới bắt đầu', time: '07:45' },
				{ id: 8, title: 'Học tập', time: '19:20' },
			],
		},
	]

	const toggleDay = (date: string) => {
		setExpandedDays((prev) =>
			prev.includes(date)
				? prev.filter((d) => d !== date)
				: [...prev, date],
		)
	}
	return (
		<div className="flex-1 p-6 overflow-y-auto">
			<div className="space-y-4">
				<h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
					Các ngày gần đây
				</h2>

				<div className="space-y-2">
					{diaryEntries.map((entry, index) => (
						<div
							key={entry.date}
							className={`space-y-1 ${
								expandedDays.includes(entry.date)
									? 'border-1 border-gray-200 rounded-lg'
									: ''
							}`}
						>
							<div
								onClick={() => toggleDay(entry.date)}
								className={`flex items-center justify-between p-3 rounded-lg border transition-colors  ${
									entry.hasEntry
										? 'cursor-pointer hover:bg-diary-primary/20'
										: ''
								} ${
									expandedDays.includes(entry.date)
										? 'bg-diary-primary/40 '
										: ''
								}`}
							>
								<div className="flex items-center gap-3">
									<Calendar className="w-4 h-4 text-muted-foreground" />
									<span className="text-sm font-medium">
										Ngày {entry.date}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<div
										className={`w-2 h-2 rounded-full ${
											entry.hasEntry
												? 'bg-diary-accent'
												: 'bg-muted-foreground/30'
										}`}
									/>
									{entry.hasEntry &&
										(expandedDays.includes(entry.date) ? (
											<ChevronDown className="w-4 h-4 text-muted-foreground" />
										) : (
											<ChevronRight className="w-4 h-4 text-muted-foreground" />
										))}
								</div>
							</div>

							{expandedDays.includes(entry.date) &&
								entry.hasEntry && (
									<div className="ml-4 space-y-1 ">
										{entry.entries.map((diaryEntry) => (
											<div
												key={diaryEntry.id}
												className="flex items-center justify-between p-2 rounded-md hover:bg-muted/30 cursor-pointer transition-colors"
											>
												<div className="flex-1">
													<p className="text-xs font-medium text-foreground">
														{diaryEntry.title}
													</p>
													<p className="text-xs text-muted-foreground">
														{diaryEntry.time}
													</p>
												</div>
											</div>
										))}
									</div>
								)}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
