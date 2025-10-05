'use client'

import { Trash2 } from 'lucide-react'
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

interface DeleteDiaryDialogProps {
	onDelete: () => Promise<void>
	variant?: 'icon' | 'button'
}

export default function DeleteDiaryDialog({
	onDelete,
	variant = 'button',
}: DeleteDiaryDialogProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				{variant === 'icon' ? (
					<button
						className="p-2 rounded-lg hover:bg-destructive/10"
						title="Xóa"
					>
						<Trash2 className="w-5 h-5 text-destructive" />
					</button>
				) : (
					<button className="px-4 py-2 rounded-lg border border-destructive/20 hover:bg-destructive/10 text-destructive transition-colors flex items-center gap-2">
						<Trash2 className="w-4 h-4" />
						<span className="text-sm">Xóa</span>
					</button>
				)}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Xác nhận xóa nhật ký</AlertDialogTitle>
					<AlertDialogDescription>
						Bạn có chắc chắn muốn xóa nhật ký này không? Hành động
						này không thể hoàn tác.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Hủy</AlertDialogCancel>
					<AlertDialogAction
						onClick={onDelete}
						className="bg-destructive text-white hover:bg-destructive/90"
					>
						Xóa
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
