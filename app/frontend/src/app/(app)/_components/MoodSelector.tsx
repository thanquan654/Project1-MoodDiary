'use client'

import { useState } from 'react'

const moods = [
	{
		id: 'angry',
		label: 'Tức giận',
		color: 'bg-emotion-very-sad',
		emoji: '😡',
	},
	{ id: 'anxious', label: 'Lo lắng', color: 'bg-emotion-sad', emoji: '😑' },
	{
		id: 'sad',
		label: 'Buồn',
		color: 'bg-emotion-neutral',
		emoji: '😢',
	},
	{
		id: 'neutual',
		label: 'Trung tính',
		color: 'bg-emotion-happy',
		emoji: '😐',
	},
	{
		id: 'happy',
		label: 'Vui',
		color: 'bg-emotion-very-happy',
		emoji: '😄',
	},
]

export function MoodSelector() {
	const [selectedMood, setSelectedMood] = useState<string | null>(null)
	const [additionalContent, setAdditionalContent] = useState('')
	const [isSubmitted, setIsSubmitted] = useState(false)

	const handleSubmit = () => {
		if (selectedMood) {
			const mood = moods.find((mood) => mood.id === selectedMood)?.label
			console.log('[v0] Mood submitted:', {
				mood: moods.find((mood) => mood.id === selectedMood)?.label,
				content: additionalContent,
			})
			setIsSubmitted(true)
			// Reset after 2 seconds
			setTimeout(() => {
				setIsSubmitted(false)
				setSelectedMood(null)
				setAdditionalContent('')
			}, 2000)
		}
	}

	return (
		<div className="bg-[#fcfcfa] dark:bg-[#2d2c2a] rounded-md shadow-2xs p-4 border border-border">
			{isSubmitted ? (
				<div className="text-center py-8">
					<div className="text-4xl mb-2">✅</div>
					<p className="text-foreground font-medium">
						Cảm ơn bạn đã chia sẻ!
					</p>
					<p className="text-muted-foreground text-sm">
						Cảm xúc của bạn đã được ghi lại.
					</p>
				</div>
			) : (
				<div className="space-y-4">
					<div>
						<h3 className="text-lg font-semibold text-foreground mb-2">
							Check-in cảm xúc
						</h3>
					</div>

					<div className="flex justify-between items-center gap-2 mb-4">
						{moods.map((mood) => (
							<button
								key={mood.id}
								onClick={() => setSelectedMood(mood.id)}
								className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-lg
                  transition-all duration-200 hover:scale-110
                  ${mood.color}
                  ${
						selectedMood === mood.id
							? 'ring-2 ring-diary-primary ring-offset-2'
							: ''
					}
                `}
								title={mood.label}
							>
								{mood.emoji}
							</button>
						))}
					</div>

					<div className="text-center mb-4">
						{moods.map((mood) => (
							<span
								key={mood.id}
								className={`text-caption transition-opacity ${
									selectedMood === mood.id
										? 'opacity-100'
										: 'opacity-0'
								}`}
							>
								{selectedMood === mood.id ? mood.label : ''}
							</span>
						))}
					</div>

					{selectedMood && (
						<div className="space-y-4">
							<div>
								<label
									htmlFor="mood-content"
									className="block text-sm font-medium text-foreground mb-2"
								>
									Bạn có muốn chia sẻ thêm gì không?
								</label>
								<textarea
									id="mood-content"
									value={additionalContent}
									onChange={(e) =>
										setAdditionalContent(e.target.value)
									}
									placeholder="Hôm nay có gì đặc biệt..."
									className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-diary-primary focus:border-transparent resize-none"
									rows={3}
								/>
							</div>

							<button
								onClick={handleSubmit}
								className="w-full bg-diary-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-diary-primary/90 transition-colors"
							>
								Xác nhận
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
