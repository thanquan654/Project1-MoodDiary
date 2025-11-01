'use client'

import type React from 'react'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageCircleMore, Send, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useMediaQuery } from '@/hooks/useMobile'

interface Message {
	id: string
	type: 'user' | 'ai'
	content: string
	timestamp: Date
}

export function ChatBot() {
	const pathname = usePathname()
	const isMobile = useMediaQuery('(max-width: 768px)')

	const [isOpen, setIsOpen] = useState(false)
	const [messages, setMessages] = useState<Message[]>([
		{
			id: '1',
			type: 'ai',
			content:
				'Xin chào! 👋 Tôi là trợ lý AI của bạn. Tôi có thể giúp bạn viết nhật ký, trả lời câu hỏi về cảm xúc, hoặc chỉ đơn giản là lắng nghe. Bạn cảm thấy thế nào hôm nay?',
			timestamp: new Date(),
		},
	])
	const [inputValue, setInputValue] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const chatWindowRef = useRef<HTMLDivElement>(null)

	// Check if chat should be visible on current page
	const shouldShowChat =
		pathname === '/dashboard' || pathname.startsWith('/dashboard/diary')

	// Scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	const handleSendMessage = async () => {
		if (!inputValue.trim()) return

		// Add user message
		const userMessage: Message = {
			id: Date.now().toString(),
			type: 'user',
			content: inputValue,
			timestamp: new Date(),
		}

		setMessages((prev) => [...prev, userMessage])
		setInputValue('')
		setIsLoading(true)

		// Simulate AI response delay
		setTimeout(() => {
			const aiResponse: Message = {
				id: (Date.now() + 1).toString(),
				type: 'ai',
				content:
					'Cảm ơn bạn đã chia sẻ. Đó là điều rất có ý nghĩa. Hãy tiếp tục viết nhật ký để theo dõi cảm xúc của mình. 💭',
				timestamp: new Date(),
			}
			setMessages((prev) => [...prev, aiResponse])
			setIsLoading(false)
		}, 800)
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSendMessage()
		}
	}

	if (!shouldShowChat) return null

	return (
		<>
			{/* Floating Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
					isOpen
						? 'bg-diary-primary text-white w-12 h-12 opacity-50 pointer-events-none'
						: 'bg-diary-primary hover:bg-diary-primary/90 text-white w-14 h-14'
				} ${
					isMobile && 'bottom-20 right-2 w-10 h-10'
				} bg-black dark:bg-white dark:hover:bg-primary/90`}
			>
				<span
					className={`transition-opacity duration-200 ${
						isOpen ? 'opacity-50' : 'opacity-100'
					}`}
				>
					<MessageCircleMore />
				</span>
			</button>

			{/* Chat Window */}
			{isOpen && (
				<div
					ref={chatWindowRef}
					className={`fixed z-50 flex flex-col transition-all duration-300 ${
						isMobile
							? 'inset-0 rounded-none'
							: 'bottom-20 right-6 w-96 h-96 rounded-lg shadow-2xl border border-border'
					} bg-card dark:bg-card`}
				>
					{/* Header */}
					<div className="flex items-center justify-between p-4 border-b border-border">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 rounded-full bg-diary-primary/20 dark:bg-primary/20 flex items-center justify-center">
								<span className="text-diary-primary dark:text-primary text-lg">
									🤖
								</span>
							</div>
							<h3 className="font-semibold text-foreground">
								Chat với AI
							</h3>
						</div>
						<button
							onClick={() => setIsOpen(false)}
							className="p-1 hover:bg-muted rounded-md transition-colors"
							aria-label="Close chat"
						>
							<X className="w-5 h-5 text-foreground" />
						</button>
					</div>

					{/* Messages Area */}
					<div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background dark:bg-background">
						{messages.map((message) => (
							<div
								key={message.id}
								className={`flex ${
									message.type === 'user'
										? 'justify-end'
										: 'justify-start'
								}`}
							>
								<div
									className={`flex items-end gap-2 max-w-xs ${
										message.type === 'user'
											? 'flex-row-reverse'
											: 'flex-row'
									}`}
								>
									{message.type === 'ai' && (
										<div className="w-7 h-7 rounded-full bg-diary-primary/30 dark:bg-primary/30 flex-shrink-0 flex items-center justify-center text-sm">
											🤖
										</div>
									)}
									<div
										className={`px-3 py-2 rounded-lg ${
											message.type === 'user'
												? 'bg-diary-primary dark:bg-primary text-white rounded-br-none'
												: 'bg-muted text-foreground rounded-bl-none'
										}`}
									>
										<p className="text-sm break-words">
											{message.content}
										</p>
									</div>
								</div>
							</div>
						))}
						{isLoading && (
							<div className="flex justify-start">
								<div className="flex items-end gap-2">
									<div className="w-7 h-7 rounded-full bg-diary-primary/30 dark:bg-primary/30 flex-shrink-0 flex items-center justify-center">
										🤖
									</div>
									<div className="bg-muted text-foreground px-3 py-2 rounded-lg rounded-bl-none">
										<div className="flex gap-1">
											<div className="w-2 h-2 bg-foreground rounded-full animate-bounce"></div>
											<div
												className="w-2 h-2 bg-foreground rounded-full animate-bounce"
												style={{
													animationDelay: '0.2s',
												}}
											></div>
											<div
												className="w-2 h-2 bg-foreground rounded-full animate-bounce"
												style={{
													animationDelay: '0.4s',
												}}
											></div>
										</div>
									</div>
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* Input Area */}
					<div className="p-4 border-t border-border bg-card dark:bg-card">
						<div className="flex gap-2">
							<Input
								type="text"
								placeholder="Nhập tin nhắn..."
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								onKeyUp={handleKeyPress}
								disabled={isLoading}
								className="flex-1 bg-background dark:bg-background"
							/>
							<Button
								onClick={handleSendMessage}
								disabled={isLoading || !inputValue.trim()}
								size="icon"
								className="bg-diary-primary hover:bg-diary-primary/90 dark:bg-primary dark:hover:bg-primary/90"
							>
								<Send className="w-4 h-4" />
							</Button>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
