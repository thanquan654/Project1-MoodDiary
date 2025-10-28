'use client'

import { useState } from 'react'

const questions = [
	'Điều gì khiến bạn cảm thấy biết ơn nhất hôm nay?',
	'Bạn đã học được gì mới trong ngày hôm nay?',
	'Khoảnh khắc nào trong ngày khiến bạn cảm thấy hạnh phúc nhất?',
	'Bạn muốn cải thiện điều gì trong ngày mai?',
	'Ai là người đã làm cho ngày của bạn trở nên đặc biệt?',
]

export function QuickQuestion() {
	const [currentQuestion] = useState(
		questions[Math.floor(Math.random() * questions.length)],
	)
	const [answer, setAnswer] = useState('')
	const [isSubmitted, setIsSubmitted] = useState(false)

	const handleSubmit = () => {
		if (answer.trim()) {
			console.log('[v0] Quick question answered:', {
				question: currentQuestion,
				answer,
			})
			setIsSubmitted(true)
			// Reset after 2 seconds
			setTimeout(() => {
				setIsSubmitted(false)
				setAnswer('')
			}, 2000)
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
						<p className="text-foreground mb-4">
							{currentQuestion}
						</p>
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

					<button
						onClick={handleSubmit}
						disabled={!answer.trim()}
						className="w-full bg-diary-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-diary-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Trả lời
					</button>
				</div>
			)}
		</div>
	)
}
