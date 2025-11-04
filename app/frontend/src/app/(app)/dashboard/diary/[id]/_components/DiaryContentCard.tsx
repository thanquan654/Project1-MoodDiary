import { Calendar, Clock, Heart, ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface DiaryData {
	id: number
	title: string
	content: string
	emotion: string
	advice: string
	media: Array<{ id: number; mediaUrl: string }>
	createdAt: string
	updatedAt: string | null
}

interface DiaryContentCardProps {
	diary: DiaryData
}

export default function DiaryContentCard({ diary }: DiaryContentCardProps) {
	return (
		<div className="bg-card rounded-2xl border border-border overflow-hidden">
			{/* Header Info */}
			<div className="p-3 md:p-6 border-b border-border">
				<div className="flex items-start justify-between mb-4">
					<h2 className="text-xl font-semibold text-foreground leading-tight">
						{diary.title}
					</h2>
					<div
						className={`w-8 h-8 rounded-full flex items-center justify-center`}
					>
						<Heart className="w-4 h-4 text-white" />
					</div>
				</div>

				<div className="flex flex-row items-start md:items-center gap-4 text-sm text-foreground">
					<div className="flex items-center gap-1">
						<Calendar className="w-4 h-4" />
						<span>
							{new Date(diary.createdAt).toLocaleDateString(
								'vi-VN',
							)}
						</span>
					</div>
					<span className="hidden md:block">{' ● '}</span>
					<div className="flex items-center gap-1">
						<Clock className="w-4 h-4" />
						<span>
							{new Date(diary.createdAt).toLocaleTimeString(
								'vi-VI',
							)}
						</span>
					</div>
					<span className="hidden md:block">{' ● '}</span>
					<div className="flex items-center gap-2">
						<div className={`w-3 h-3 rounded-full`} />
						<span>{diary.emotion}</span>
					</div>
				</div>

				{/* Advice Section */}
				<div className="mt-6 p-4 bg-primary/10 rounded-lg">
					<div className="flex items-center gap-2 mb-2">
						<Heart className="w-5 h-5 text-primary" />
						<h3 className="text-md font-semibold text-primary">
							Gợi ý cho bạn
						</h3>
					</div>
					<p className="text-sm text-foreground/80 leading-relaxed">
						{diary.advice}
					</p>
				</div>
			</div>

			{/* Content */}
			<div className="p-3 md:p-6">
				<div className="prose prose-gray max-w-none">
					{diary.content.split('\n').map((paragraph, index) => (
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
			{diary.media && diary.media.length > 0 && (
				<div className="p-6 pt-0">
					<div className="flex items-center gap-2 mb-4">
						<ImageIcon className="w-4 h-4 text-foreground" />
						<span className="text-sm font-medium text-foreground">
							Hình ảnh ({diary.media.length})
						</span>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{diary.media.map((image) => (
							<div
								key={image.id}
								className="aspect-video bg-gray-100 rounded-lg overflow-hidden"
							>
								<Image
									src={image.mediaUrl || '/placeholder.svg'}
									width={600}
									height={600}
									alt={`Hình ảnh ${image.id}`}
									className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
								/>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
