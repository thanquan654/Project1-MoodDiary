/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Camera, Mic, MicOff, X } from 'lucide-react'
import Image from 'next/image'

export default function NewDiaryForm() {
	const router = useRouter()
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const [error, setError] = useState({
		title: '',
		content: '',
		image: '',
		form: '',
	})
	const [images, setImages] = useState<File[]>([])
	const [isRecording, setIsRecording] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const recognitionRef = useRef<any>(null)

	// Speech Recognition
	useEffect(() => {
		if (
			typeof window !== 'undefined' &&
			('SpeechRecognition' in window ||
				'webkitSpeechRecognition' in window)
		) {
			const SpeechRecognition =
				(window as any).SpeechRecognition ||
				(window as any).webkitSpeechRecognition
			recognitionRef.current = new SpeechRecognition()
			recognitionRef.current.continuous = true
			recognitionRef.current.interimResults = true
			recognitionRef.current.lang = 'vi-VN'

			recognitionRef.current.onresult = (event: any) => {
				let finalTranscript = ''
				for (let i = event.resultIndex; i < event.results.length; i++) {
					if (event.results[i].isFinal) {
						finalTranscript += event.results[i][0].transcript
					}
				}
				if (finalTranscript) {
					setContent((prev) => prev + finalTranscript + ' ')
				}
			}

			recognitionRef.current.onerror = (event: any) => {
				console.error('Speech recognition error:', event.error)
				setIsRecording(false)
			}

			recognitionRef.current.onend = () => {
				setIsRecording(false)
			}
		}
	}, [])

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || [])

		for (const file of files) {
			if (file.size > 10 * 1024 * 1024) {
				// 10 MB limit
				setError((prev) => ({
					...prev,
					image: 'Chỉ hỗ trợ định dạng .jpg, .png và dung lượng ≤ 10MB.',
				}))
				return
			}

			if (!['image/jpeg', 'image/png'].includes(file.type)) {
				setError((prev) => ({
					...prev,
					image: 'Chỉ hỗ trợ định dạng .jpg, .png và dung lượng ≤ 10MB.',
				}))
				return
			}
		}

		setImages((prev) => {
			const remainingSlots = 5 - prev.length
			if (remainingSlots <= 0) return prev
			const filesToAdd = files.slice(0, remainingSlots)
			return [...prev, ...filesToAdd]
		})
	}

	const removeImage = (index: number) => {
		setImages((prev) => prev.filter((_, i) => i !== index))
	}

	const toggleRecording = () => {
		if (!recognitionRef.current) {
			alert('Trình duyệt không hỗ trợ nhận dạng giọng nói')
			return
		}

		if (isRecording) {
			recognitionRef.current.stop()
			setIsRecording(false)
		} else {
			recognitionRef.current.start()
			setIsRecording(true)
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		setError({
			title: '',
			content: '',
			form: '',
			image: '',
		})

		if (!title.trim()) {
			setError((prev) => ({
				...prev,
				title: 'Vui lòng nhập tiêu đề',
			}))
			return
		}

		if (!content.trim()) {
			setError((prev) => ({
				...prev,
				content: 'Vui lòng nhập nội dung nhật ký',
			}))
			return
		}

		setIsSubmitting(true)

		try {
			const formData = new FormData()
			formData.append('title', title)
			formData.append('content', content)
			images.forEach((image) => {
				formData.append('newImages', image)
			})

			const response = await fetch('/api/diary', {
				method: 'POST',
				body: formData,
			})

			if (!response.ok) {
				const errorData = (await (await response).json()).message

				setError((prev) => ({
					...prev,
					form: errorData,
				}))
			}

			router.push('/dashboard/diary')
		} catch (error) {
			console.error('Error creating diary:', error)
			// Handle error appropriately
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Title Input */}
			<Card className="gap-2">
				<CardHeader>
					<CardTitle className="text-base font-medium">
						Tiêu đề
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Nhập tiêu đề nhật ký..."
						className="text-base"
					/>
				</CardContent>
				{error.title && (
					<CardFooter className="text-red-500">
						{error.title}
					</CardFooter>
				)}
			</Card>

			{/* Content Input */}
			<Card className="gap-2">
				<CardHeader>
					<CardTitle className="text-base font-medium flex items-center justify-between">
						Nội dung
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={toggleRecording}
							className={`p-2 ${
								isRecording
									? 'text-red-500'
									: 'text-diary-text-secondary'
							}`}
						>
							{isRecording ? (
								<MicOff className="h-4 w-4" />
							) : (
								<Mic className="h-4 w-4" />
							)}
						</Button>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="Chia sẻ những suy nghĩ của bạn... (Nhấn mic để ghi âm)"
						className="min-h-32 text-base resize-none"
					/>
					{isRecording && (
						<div className="mt-2 flex items-center gap-2 text-red-500 text-sm">
							<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
							Đang ghi âm...
						</div>
					)}
				</CardContent>
				{error.content && (
					<CardFooter className="text-red-500">
						{error.content}
					</CardFooter>
				)}
			</Card>

			{/* Image Upload */}
			<Card className="gap-2">
				<CardHeader>
					<CardTitle className="text-base font-medium">
						Hình ảnh{' '}
						<span className="text-sm text-muted-foreground">
							(Tối đa 5 hình ảnh)
						</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{/* Upload Button */}
						{images.length < 5 && (
							<Button
								type="button"
								variant="outline"
								onClick={() => fileInputRef.current?.click()}
								className="w-full h-20 border-2 border-dashed border-diary-border hover:border-diary-primary/50 flex flex-col items-center gap-2"
							>
								<Camera className="h-6 w-6 text-diary-text-secondary" />
								<span className="text-sm text-diary-text-secondary">
									Thêm hình ảnh
								</span>
							</Button>
						)}

						<input
							ref={fileInputRef}
							type="file"
							accept="image/jpeg, image/png"
							max={5}
							multiple
							onChange={handleImageUpload}
							className="hidden"
						/>

						{/* Image Preview */}
						{images.length > 0 && (
							<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
								{images.map((image, index) => (
									<div key={index} className="relative group">
										<Image
											src={URL.createObjectURL(image)}
											width={150}
											height={200}
											alt={`Preview ${index + 1}`}
											className="w-full h-24 object-cover rounded-lg border border-diary-border"
										/>
										<button
											type="button"
											onClick={() => removeImage(index)}
											className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
										>
											<X className="h-3 w-3" />
										</button>
									</div>
								))}
							</div>
						)}
						{error.image && (
							<CardFooter className="text-red-500">
								{error.image}
							</CardFooter>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Submit Button */}
			<div className="flex gap-3 pt-4">
				<Button
					type="button"
					variant="outline"
					className="flex-1 bg-transparent"
					onClick={() => router.back()}
				>
					Hủy
				</Button>
				<Button
					type="submit"
					className="flex-1 bg-diary-primary hover:bg-diary-primary/90"
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Đang lưu...' : 'Lưu nhật ký'}
				</Button>
			</div>
		</form>
	)
}
