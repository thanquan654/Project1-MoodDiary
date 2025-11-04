'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Info, MessageCircleMore, RotateCcw, Send, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useMediaQuery } from '@/hooks/useMobile'
import { useChat } from '@ai-sdk/react'
import { TextStreamChatTransport, UIMessage } from 'ai'
import Markdown from 'markdown-to-jsx'
import {
	getChatbotContextApi,
	getChatbotMessageApi,
	resetChatbotConversationApi,
	saveChatbotMessageApi,
} from '@/lib/apis/chatbotApi'
import { useAtomValue } from 'jotai'
import { tokenAtom } from '@/store/userAtom'
import { v4 as uuidv4 } from 'uuid'

export function ChatBot() {
	const token = useAtomValue(tokenAtom)

	const pathname = usePathname()
	const isMobile = useMediaQuery('(max-width: 768px)')

	const [isOpen, setIsOpen] = useState(false)
	const [context, setContext] = useState('')
	const [inputValue, setInputValue] = useState('')
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const chatWindowRef = useRef<HTMLDivElement>(null)
	const [chatbotError, setChatbotErrors] = useState('')
	const { messages, sendMessage, setMessages } = useChat({
		transport: new TextStreamChatTransport({
			api: '/api/chat',
		}),
		onFinish: ({ message }) => {
			const savedMessageToBE = {
				isUserMessage: false,
				message: message.parts.at(-1)?.text || '',
			}
			saveChatbotMessageApi(savedMessageToBE, token || undefined)
		},
	})

	// Check if chat should be visible on current page
	const shouldShowChat =
		pathname === '/dashboard' || pathname.startsWith('/dashboard/diary')

	useEffect(() => {
		const fetchData = async () => {
			// Call to get message history
			const data = await getChatbotMessageApi(token || undefined)

			if (data.messages.length) {
				const convertedMessages = data.messages.map(
					(message: { message: string; isUserMessage: boolean }) => ({
						id: uuidv4(),
						role: message.isUserMessage ? 'user' : 'assistant',
						parts: [
							{
								type: 'text',
								text: message.message,
							},
						],
					}),
				)

				setMessages(convertedMessages)
			} else {
				const contextData = await getChatbotContextApi(
					token || undefined,
				)
				if (contextData) {
					setContext(contextData.context)
					if (!messages.length) {
						saveChatbotMessageApi(
							{
								isUserMessage: false,
								message: contextData.initialMessage,
							},
							token || undefined,
						)
						setMessages([
							{
								id: '1',
								role: 'assistant',
								parts: [
									{
										type: 'text',
										text: contextData.initialMessage,
									},
								],
							},
						])
					}
				}
			}
		}

		if (!messages.length) fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	const handleSendMessage = async () => {
		if (!inputValue.trim()) return
		saveChatbotMessageApi(
			{
				isUserMessage: true,
				message: inputValue.trim(),
			},
			token || undefined,
		)

		sendMessage(
			{ text: inputValue },
			{
				body: {
					journals: context,
				},
			},
		)
		setInputValue('')
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
				} bg-black hover:bg-diary-primary/90`}
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
							: 'bottom-20 right-6 w-96 h-2/3 rounded-lg shadow-2xl border border-border'
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
						<div>
							<button
								className="p-1 hover:bg-muted rounded-md transition-colors"
								onClick={async () => {
									const data =
										await resetChatbotConversationApi(
											token || undefined,
										)
									if (
										data.message ===
										'Reset cuộc trò chuyện thành công'
									) {
										setMessages([])
									}
								}}
								aria-label="Reset chat"
							>
								<RotateCcw className="w-5 h-5 text-foreground scale-95" />
							</button>
							<button
								onClick={() => setIsOpen(false)}
								className="p-1 hover:bg-muted rounded-md transition-colors"
								aria-label="Close chat"
							>
								<X className="w-5 h-5 text-foreground" />
							</button>
						</div>
					</div>

					{/* Messages Area */}
					<div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background dark:bg-background">
						{messages.map((message) => (
							<div
								key={message.id}
								className={`flex ${
									message.role === 'user'
										? 'justify-end'
										: 'justify-start'
								}`}
							>
								<div
									className={`flex items-end gap-2 max-w-xs ${
										message.role === 'user'
											? 'flex-row-reverse'
											: 'flex-row'
									}`}
								>
									{message.role !== 'user' && (
										<div className="w-7 h-7 rounded-full bg-diary-primary/30 flex-shrink-0 flex items-center justify-center text-sm">
											🤖
										</div>
									)}
									<div
										className={`px-3 py-2 rounded-lg ${
											message.role === 'user'
												? 'bg-diary-primary text-white rounded-br-none'
												: 'bg-muted text-foreground rounded-bl-none'
										}`}
									>
										<p className="text-sm break-words">
											{message.parts.map((part, i) => {
												switch (part.type) {
													case 'text':
														return (
															<Markdown
																key={`${message.id}-${i}`}
															>
																{part.text}
															</Markdown>
														)
												}
											})}
										</p>
									</div>
								</div>
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>

					{/* Input Area */}
					<div className="p-4 border-t border-border bg-card dark:bg-card">
						{chatbotError && (
							<div className="flex justify-center gap-2 items-center mb-2 bg-gray-400/50 py-1 rounded-xl text-red-400 text-sm text-center">
								<Info className="w-5 h-5 text-red-400" />{' '}
								<p>{chatbotError}</p>
							</div>
						)}
						<div className="flex gap-2">
							<Input
								type="text"
								placeholder="Nhập tin nhắn..."
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								onKeyUp={handleKeyPress}
								className="flex-1 bg-background dark:bg-background"
							/>
							<Button
								onClick={handleSendMessage}
								disabled={!inputValue.trim()}
								size="icon"
								className="bg-diary-primary hover:bg-diary-primary/90"
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
