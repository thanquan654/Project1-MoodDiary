import { getDiarysListApi } from '@/lib/apis/diaryApi'
import Header from '@/app/(app)/_components/DashboardHeader'
import SearchSection from '@/app/(app)/dashboard/diary/_components/SearchSection'
import { transformDiaryDataList } from '@/helpers/transformDiaryData'
import { cookies } from 'next/headers'
import DiaryList from '@/app/(app)/dashboard/diary/_components/DiaryList'

export const dynamic = 'force-dynamic'

export default async function DiariesPage() {
	const cookieStore = cookies()
	const token = cookieStore.get('user_token')?.value

	const response = await getDiarysListApi(token)
	const diaryList = transformDiaryDataList(response?.data)

	const toggleDay = (date: string) => {
		setExpandedDays((prev) =>
			prev.includes(date)
				? prev.filter((d) => d !== date)
				: [...prev, date],
		)
	}

	const onKeywordsearch = (value: string) => {
		console.log(value)
	}
	const onDateSearch = (
		startDate: Date | undefined,
		endDate: Date | undefined,
	) => {
		console.log(startDate, endDate)
	}

	return (
		<div className="min-h-screen bg-background">
			<Header />

			<main className="pb-20 lg:pb-0">
				<div className="p-4 space-y-6">
					{/* Search Section */}
					<SearchSection
						onKeywordSearch={onKeywordsearch}
						onDateSearch={onDateSearch}
					/>

					<div className="flex justify-end">
						<Link href={'/dashboard/diary/new'}>
							<Button className="bg-diary-primary hover:bg-diary-primary/90 text-diary-text-dark ">
								<BookPlus className="mr-2" />
								<span>Thêm nhật ký mới</span>
							</Button>
						</Link>
					</div>

					{/* Diary List */}
					<div className="space-y-4">
						{diaryList.map((dayEntry) => (
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
										<div className="divide-y divide-border">
											{dayEntry.entries.map((entry) => (
												<div
													key={entry.id}
													className="p-4 hover:bg-muted/30 transition-colors group"
												>
													<div className="flex items-center gap-3">
														<span>
															{
																emotionIconMap[
																	entry
																		.emotion
																]
															}
														</span>
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
																	{entry.time}
																</span>
															</div>
															<p className="text-xs text-muted-foreground line-clamp-2">
																{entry.preview}
															</p>
														</Link>
													</div>
												</div>
											))}
										</div>
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
