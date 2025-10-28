'use client'

import { createDiaryApi } from '@/lib/apis/diaryApi'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function QuickQuestion({ question }: { question: string }) {
	const router = useRouter()
	const [answer, setAnswer] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [submitError, setSubmitError] = useState('')

	const handleSubmit = async () => {
		if (answer.trim()) {
			setIsLoading(true)
			setSubmitError('')
			try {
				const formData = new FormData()
				formData.append(
					'title',
					`Nhật ký nhanh ngày ${new Date().toLocaleDateString(
						'vi-VI',
					)}`,
				)
				formData.append('content', `${question}\n${answer}`)

				const data = await createDiaryApi(formData)

				if (data?.code) {
					setSubmitError(data.message)
				} else {
					setIsSubmitted(true)
					setTimeout(() => {
						router.refresh()
					}, 1000)
				}
			} catch (error) {
				console.error('Failed to submit answer:', error)
				setSubmitError('Đã có lỗi xảy ra. Vui lòng thử lại.')
			} finally {
				setIsLoading(false)
			}
		}
	}

	return (
		<div className="bg-[#fcfcfa] dark:bg-[#2d2c2a] rounded-md shadow-2xs p-4 border border-border">
			{isSubmitted ? (
				<div className="text-center py-6">
					<div className="text-3xl mb-2">💭</div>
					<p className="text-foreground font-medium">
						Cảm ơn bạn đã suy ngẫm!
					</p>
					<p className="text-muted-foreground text-sm">
						Câu trả lời của bạn đã được lưu lại.
					</p>
				</div>
			) : (
				<div className="space-y-4">
					<div>
						<h3 className="text-lg font-semibold text-foreground mb-2">
							Câu hỏi nhanh
						</h3>
						<p className="text-foreground mb-4">{question}</p>
					</div>

					<div>
						<textarea
							value={answer}
							onChange={(e) => setAnswer(e.target.value)}
							placeholder="Chia sẻ suy nghĩ của bạn..."
							className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-diary-primary focus:border-transparent resize-none"
							rows={3}
						/>
					</div>

					{submitError && (
						<div className="text-red-500 text-sm text-center">
							{submitError}
						</div>
					)}

					<button
						onClick={handleSubmit}
						disabled={!answer.trim()}
						className="flex justify-center w-full bg-diary-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-diary-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? (
							<Loader2 className="animate-spin" />
						) : (
							'Trả lời'
						)}
					</button>
				</div>
			)}
		</div>
	)
}
