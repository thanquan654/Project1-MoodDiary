'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteDiaryApi } from '@/lib/apis/diaryApi'
import DiaryHeader from './DiaryHeader'
import DiaryContentCard from './DiaryContentCard'

interface DiaryData {
	id: number
	title: string
	content: string
	emotion: string
	media: Array<{ id: number; mediaUrl: string }>
	createdAt: string
	updatedAt: string | null
}

interface DiaryDetailClientProps {
	initialData: DiaryData
	params: { id: string }
}

export default function DiaryDetailClient({
	initialData,
}: DiaryDetailClientProps) {
	const router = useRouter()
	const [error, setError] = useState<string | null>(null)

	const handleDeleteEntry = async () => {
		try {
			if (!initialData?.id) return
			await deleteDiaryApi(initialData.id)
			router.push('/dashboard/diary')
		} catch (err) {
			console.error('Failed to delete diary:', err)
			setError('Failed to delete diary. Please try again.')
		}
	}

	if (error) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-xl font-semibold mb-2">Error</h2>
					<p className="text-muted-foreground">{error}</p>
				</div>
			</div>
		)
	}

	return (
		<div className="flex flex-col min-h-screen bg-background">
			<div className="max-w-4xl mx-auto m-2 mt-6">
				<DiaryHeader onDelete={handleDeleteEntry} />
				<DiaryContentCard diary={initialData} />
			</div>
		</div>
	)
}
