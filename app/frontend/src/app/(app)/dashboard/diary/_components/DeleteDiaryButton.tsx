'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
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
import { deleteDiaryApi } from '@/lib/apis/diaryApi'

interface DeleteDiaryButtonProps {
	id: number
}

export default function DeleteDiaryButton({ id }: DeleteDiaryButtonProps) {
	const router = useRouter()

	const handleDelete = async () => {
		try {
			await deleteDiaryApi(id)
			router.push('/dashboard/diary')
			router.refresh()
		} catch (error) {
			console.error('Error deleting diary:', error)
		}
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="ghost" size="sm">
					<Trash2 className="w-5 h-5 text-destructive" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Bạn có chắc chắn muốn xóa?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Hành động này không thể hoàn tác. Nhật ký này sẽ bị xóa
						vĩnh viễn.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Hủy</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete}>
						Xóa
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
