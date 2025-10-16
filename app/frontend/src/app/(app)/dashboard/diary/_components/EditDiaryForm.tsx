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
import Link from 'next/link'
import Image from 'next/image'

interface EditDiaryFormProps {
	diary: {
		id: string
		title: string
		content: string
		mood: string
		images: {
			id: number
			url: string
		}[]
	}
}

export default function EditDiaryForm({ diary }: EditDiaryFormProps) {
	const router = useRouter()

	// In real app, fetch diary entry by ID
	const entry = diary
	const id = entry.id

	const [title, setTitle] = useState(entry.title)
	const [content, setContent] = useState(entry.content)
	const [existingImages, setExistingImages] = useState(entry.images)
	const [newImages, setNewImages] = useState<File[]>([])
	const [error, setError] = useState({
		title: '',
		content: '',
		image: '',
		form: '',
	})
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

		setNewImages((prev) => {
			const remainingSlots = 5 - prev.length - existingImages.length
			if (remainingSlots <= 0) return prev
			const filesToAdd = files.slice(0, remainingSlots)
			return [...prev, ...filesToAdd]
		})
	}

	const removeExistingImage = (imageId: number) => {
		setExistingImages((prev) => prev.filter((img) => img.id !== imageId))
	}

	const removeNewImage = (index: number) => {
		setNewImages((prev) => prev.filter((_, i) => i !== index))
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

		// Prepare data for API
		const formData = new FormData()
		formData.append('title', title)
		formData.append('content', content)

		const existingImageIds = existingImages.map((img) => img.id)
		formData.append('ExistingImageIds', JSON.stringify(existingImageIds))

		newImages.forEach((image) => {
			formData.append('newImages', image)
		})

		await new Promise((resolve) => setTimeout(resolve, 1000))

		// FIXME: Remove when backend is ready
		console.log('[v0] Updated diary entry:', {
			id,
			title,
			content,
			existingImageIds,
			newImagesCount: newImages.length,
		})

		// router.push(`/diaries/${id}`)
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
						required
					/>
				</CardContent>
				{error.title && <CardFooter>{error.title}</CardFooter>}
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
						placeholder="Chia sẻ những suy nghĩ của bạn..."
						className="min-h-32 text-base resize-none"
						required
					/>
					{isRecording && (
						<div className="mt-2 flex items-center gap-2 text-red-500 text-sm">
							<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
							Đang ghi âm...
						</div>
					)}
				</CardContent>
				{error.content && <CardFooter>{error.content}</CardFooter>}
			</Card>

			{/* Image Management */}
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
						{/* Existing Images */}
						{existingImages.length > 0 && (
							<div>
								<p className="text-sm text-diary-text-secondary mb-3">
									Hình ảnh hiện có
								</p>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
									{existingImages.map((image) => (
										<div
											key={image.id}
											className="relative group"
										>
											<Image
												src={
													image.url ||
													'/placeholder.svg'
												}
												width={150}
												height={200}
												alt="Existing"
												className="w-full h-24 object-cover rounded-lg border border-diary-border"
											/>
											<button
												type="button"
												onClick={() =>
													removeExistingImage(
														image.id,
													)
												}
												className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
											>
												<X className="h-3 w-3" />
											</button>
										</div>
									))}
								</div>
							</div>
						)}

						{/* New Images */}
						{newImages.length > 0 && (
							<div>
								<p className="text-sm text-diary-text-secondary mb-3">
									Hình ảnh mới
								</p>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
									{newImages.map((image, index) => (
										<div
											key={index}
											className="relative group"
										>
											<Image
												src={
													URL.createObjectURL(
														image,
													) || '/placeholder.svg'
												}
												width={150}
												height={200}
												alt={`New ${index + 1}`}
												className="w-full h-24 object-cover rounded-lg border border-diary-border"
											/>
											<button
												type="button"
												onClick={() =>
													removeNewImage(index)
												}
												className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
											>
												<X className="h-3 w-3" />
											</button>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Upload Button */}
						{newImages.length + existingImages.length < 5 && (
							<Button
								type="button"
								variant="outline"
								onClick={() => fileInputRef.current?.click()}
								className="w-full h-20 border-2 border-dashed border-diary-border hover:border-diary-primary/50 flex flex-col items-center gap-2"
							>
								<Camera className="h-6 w-6 text-diary-text-secondary" />
								<span className="text-sm text-diary-text-secondary">
									Thêm hình ảnh mới
								</span>
							</Button>
						)}

						<input
							ref={fileInputRef}
							type="file"
							accept="image/jpeg, image/png"
							multiple
							max={5}
							onChange={handleImageUpload}
							className="hidden"
						/>
					</div>
				</CardContent>
				{error.image && <CardFooter>{error.image}</CardFooter>}
			</Card>

			{/* Submit Button */}
			<div className="flex gap-3 pt-4">
				<Link href={`/diaries/${id}`} className="flex-1">
					<Button
						type="button"
						variant="outline"
						className="w-full bg-transparent"
					>
						Hủy
					</Button>
				</Link>
				<Button
					type="submit"
					className="flex-1 bg-diary-primary hover:bg-diary-primary/90"
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Đang lưu...' : 'Cập nhật'}
				</Button>
			</div>
		</form>
	)
}
