'use client'

import type React from 'react'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import ForgotPasswordEmailForm from '@/app/(auth)/_components/ForgotPasswordEmailForm'

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [isEmailSent, setIsEmailSent] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		// FIXME: Simulate sending reset email
		await new Promise((resolve) => setTimeout(resolve, 2000))

		setIsEmailSent(true)
		setIsLoading(false)
	}

	if (isEmailSent) {
		return (
			<div className="min-h-screen bg-diary-bg-light dark:bg-diary-bg-dark flex items-center justify-center p-4">
				<Card className="w-full max-w-md bg-white dark:bg-diary-surface-dark border-diary-border-light dark:border-diary-border-dark">
					<CardHeader className="text-center space-y-4">
						<div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
							<CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
						</div>
						<CardTitle className="text-2xl font-semibold text-diary-text-primary-light dark:text-diary-text-primary-dark">
							Email đã được gửi
						</CardTitle>
						<CardDescription className="text-diary-text-secondary-light dark:text-diary-text-secondary-dark">
							Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến
							email của bạn
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-4 ">
						<div className="bg-diary-bg-light dark:bg-diary-bg-dark p-4 rounded-lg border border-diary-border-light dark:border-diary-border-dark">
							<p className="text-sm text-diary-text-secondary-light dark:text-diary-text-secondary-dark text-center">
								Vui lòng kiểm tra hộp thư đến (và cả thư mục
								spam) của email{' '}
								<span className="font-medium text-diary-text-primary-light dark:text-diary-text-primary-dark">
									{email}
								</span>
							</p>
						</div>

						<div className="text-center text-sm text-diary-text-secondary-light dark:text-diary-text-secondary-dark">
							Không nhận được email?{' '}
							<button
								onClick={() => setIsEmailSent(false)}
								className="text-diary-primary hover:text-diary-primary/80 font-medium transition-colors"
							>
								Gửi lại
							</button>
						</div>
					</CardContent>

					<CardFooter>
						<Link href="/login" className="w-full">
							<Button
								variant="outline"
								className="w-full bg-transparent"
							>
								<ArrowLeft className="w-4 h-4 mr-2" />
								Quay lại đăng nhập
							</Button>
						</Link>
					</CardFooter>
				</Card>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-diary-bg-light dark:bg-diary-bg-dark flex items-center justify-center p-4">
			<ForgotPasswordEmailForm
				email={email}
				setEmail={setEmail}
				isLoading={isLoading}
				handleSubmit={handleSubmit}
			/>
		</div>
	)
}
