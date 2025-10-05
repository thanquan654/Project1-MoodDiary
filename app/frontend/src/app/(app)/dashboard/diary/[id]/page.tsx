import { ArrowLeft, Calendar, Clock, Heart, ImageIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Button } from '@/components/ui/button'
import DeleteDiaryButton from '../_components/DeleteDiaryButton'
import { getDiaryByIdApi } from '@/lib/apis/diaryApi'
import { formatDate } from '@/lib/utils'

interface Props {
	params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const cookieStore = cookies()
	const token = cookieStore.get('user_token')?.value

	const diary = await getDiaryByIdApi(params.id, token)

	return {
		title: `${diary.title} - Smart Diary`,
		description: diary.content.substring(0, 160),
	}
}

export default async function DiaryDetailPage({ params }: Props) {
	const cookieStore = cookies()
	const token = (await cookieStore).get('user_token')?.value

	const diary = await getDiaryByIdApi(params.id, token)
	const createdDate = new Date(diary.createdAt)

	const handleDeleteEntry = () => {
		console.log('[v0] Deleting entry:', id)
		// In real app, this would call an API to delete the entry
		// Then redirect to diaries list
		router.push('/dashboard/diary')
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Mobile Header */}
			<div className="lg:hidden">
				<div className="flex items-center justify-between p-4 bg-card border-b border-border">
					<Link
						href="/dashboard/diary"
						className="p-2 -ml-2 rounded-lg hover:bg-muted"
					>
						<ArrowLeft className="w-5 h-5 text-muted-foreground" />
					</Link>
					<div className="text-md font-bold text-foreground">
						Chi tiết nhật ký
					</div>
					<div className="flex items-center gap-1">
						<button
							className="p-2 rounded-lg hover:bg-muted"
							title="Chỉnh sửa"
						>
							<Edit className="w-5 h-5 text-muted-foreground" />
						</button>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<button
									className="p-2 rounded-lg hover:bg-destructive/10"
									title="Xóa"
								>
									<Trash2 className="w-5 h-5 text-destructive" />
								</button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Xác nhận xóa nhật ký
									</AlertDialogTitle>
									<AlertDialogDescription>
										Bạn có chắc chắn muốn xóa nhật ký này
										không? Hành động này không thể hoàn tác.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Hủy</AlertDialogCancel>
									<AlertDialogAction
										onClick={handleDeleteEntry}
										className="bg-destructive text-white hover:bg-destructive/90"
									>
										Xóa
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</div>
			</div>

			<div className="flex">
				{/* Main Content */}
				<div className="flex-1 lg:p-8">
					<div className="max-w-4xl mx-auto">
						{/* Desktop Header */}
						<div className="hidden lg:flex items-center justify-between mb-6">
							<div className="flex items-center gap-4">
								<Link
									href="/diaries"
									className="p-2 rounded-lg hover:bg-muted"
								>
									<ArrowLeft className="w-5 h-5 text-muted-foreground" />
								</Link>
								<h1 className="text-2xl font-semibold text-foreground">
									Chi tiết nhật ký
								</h1>
							</div>
							<div className="flex items-center gap-2">
								<button className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors flex items-center gap-2">
									<Edit className="w-4 h-4" />
									<span className="text-sm">Chỉnh sửa</span>
								</button>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<button className="px-4 py-2 rounded-lg border border-destructive/20 hover:bg-destructive/10 text-destructive transition-colors flex items-center gap-2">
											<Trash2 className="w-4 h-4" />
											<span className="text-sm">Xóa</span>
										</button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Xác nhận xóa nhật ký
											</AlertDialogTitle>
											<AlertDialogDescription>
												Bạn có chắc chắn muốn xóa nhật
												ký này không? Hành động này
												không thể hoàn tác.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>
												Hủy
											</AlertDialogCancel>
											<AlertDialogAction
												onClick={handleDeleteEntry}
												className="bg-destructive text-white hover:bg-destructive/90"
											>
												Xóa
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</div>

						{/* Content Card */}
						<div className="bg-card rounded-2xl border border-border overflow-hidden">
							{/* Header Info */}
							<div className="p-6 border-b border-border">
								<div className="flex items-start justify-between mb-4">
									<h2 className="text-xl font-semibold text-foreground leading-tight">
										{entry.title}
									</h2>
									<div
										className={`w-8 h-8 rounded-full  flex items-center justify-center`}
									>
										<Heart className="w-4 h-4 text-white" />
									</div>
								</div>

								<div className="flex items-center gap-4 text-sm text-foreground">
									<div className="flex items-center gap-1">
										<Calendar className="w-4 h-4" />
										<span>
											{new Date(
												entry.createdAt,
											).toLocaleDateString('vi-VN')}
										</span>
									</div>
									<div className="flex items-center gap-1">
										<Clock className="w-4 h-4" />
										<span>
											{new Date(
												entry.createdAt,
											).toLocaleTimeString('vi-VI')}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<div
											className={`w-3 h-3 rounded-full`}
										/>
										<span>{entry.emotion}</span>
									</div>
								</div>
							</div>

							{/* Content */}
							<div className="p-6">
								<div className="prose prose-gray max-w-none">
									{entry.content
										.split('\n\n')
										.map((paragraph, index) => (
											<p
												key={index}
												className="text-foreground leading-relaxed mb-4 last:mb-0"
											>
												{paragraph}
											</p>
										))}
								</div>
							</div>

							{/* Images */}
							{entry.media && entry.media.length > 0 && (
								<div className="p-6 pt-0">
									<div className="flex items-center gap-2 mb-4">
										<ImageIcon className="w-4 h-4 text-foreground" />
										<span className="text-sm font-medium text-foreground">
											Hình ảnh ({entry.media.length})
										</span>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
										{entry.media.map((image) => (
											<div
												key={image.id}
												className="aspect-video bg-gray-100 rounded-lg overflow-hidden"
											>
												<Image
													src={
														image.mediaUrl ||
														'/placeholder.svg'
													}
													width={200}
													height={200}
													alt={`Hình ảnh ${image.id}`}
													className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
												/>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
