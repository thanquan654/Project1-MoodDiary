'use client'

import { ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'
import DeleteDiaryDialog from './DeleteDiaryDialog'

interface DiaryHeaderProps {
	onDelete: () => Promise<void>
}

export default function DiaryHeader({ onDelete }: DiaryHeaderProps) {
	return (
		<>
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
						<DeleteDiaryDialog onDelete={onDelete} variant="icon" />
					</div>
				</div>
			</div>

			{/* Desktop Header */}
			<div className="hidden lg:flex items-center justify-between mb-6">
				<div className="flex items-center gap-4">
					<Link
						href="/dashboard/diary"
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
					<DeleteDiaryDialog onDelete={onDelete} />
				</div>
			</div>
		</>
	)
}
