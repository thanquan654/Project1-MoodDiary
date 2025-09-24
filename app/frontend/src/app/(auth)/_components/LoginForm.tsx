'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import type {
	LoginFormValue,
	LoginFormError,
} from '@/app/(auth)/_types/authForm.type'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Lock, EyeOff, Eye } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import GoogleButton from 'react-google-button'
import { loginWithGoogleApi } from '@/lib/apis/authApi'

export default function LoginForm({
	values,
	errors,
	isSubmitting,
	handleChange,
	handleSubmit,
}: {
	values: LoginFormValue
	errors: LoginFormError
	isSubmitting: boolean
	handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
	handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}) {
	const [isShowPassword, setShowPassword] = useState<boolean>(false)

	return (
		<Card className="w-full max-w-md bg-white dark:bg-diary-surface-dark border-diary-border-light dark:border-diary-border-dark">
			<CardHeader className="text-center space-y-2">
				<div className="mx-auto w-16 h-16 bg-diary-primary rounded-2xl flex items-center justify-center mb-4">
					<span className="text-white font-bold text-xl">📔</span>
				</div>
				<CardTitle className="text-2xl font-semibold text-diary-text-primary-light dark:text-diary-text-primary-dark">
					Chào mừng trở lại
				</CardTitle>
				<CardDescription className="text-diary-text-secondary-light dark:text-diary-text-secondary-dark">
					Cùng ghi lại những cảm xúc của ngày hôm nay nhé.
				</CardDescription>
			</CardHeader>

			<form onSubmit={handleSubmit}>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label
							htmlFor="email"
							className="text-diary-text-primary-light dark:text-diary-text-primary-dark"
						>
							Email
						</Label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-diary-text-secondary-light dark:text-diary-text-secondary-dark w-4 h-4" />
							<Input
								id="email"
								name="email"
								type="text"
								placeholder="your@email.com"
								value={values.email}
								onChange={handleChange}
								className="pl-10 bg-diary-bg-light dark:bg-diary-bg-dark border-diary-border-light dark:border-diary-border-dark text-diary-text-primary-light dark:text-diary-text-primary-dark"
								required
							/>
						</div>
						{errors.email && (
							<p className="text-red-600 text-sm">
								{errors.email}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="password"
							className="text-diary-text-primary-light dark:text-diary-text-primary-dark"
						>
							Mật khẩu
						</Label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-diary-text-secondary-light dark:text-diary-text-secondary-dark w-4 h-4" />
							<Input
								id="password"
								name="password"
								type={isShowPassword ? 'text' : 'password'}
								placeholder="••••••••"
								value={values.password}
								onChange={handleChange}
								className="pl-10 pr-10 bg-diary-bg-light dark:bg-diary-bg-dark border-diary-border-light dark:border-diary-border-dark text-diary-text-primary-light dark:text-diary-text-primary-dark"
								required
							/>
							<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-diary-text-secondary-light dark:text-diary-text-secondary-dark hover:text-diary-text-primary-light dark:hover:text-diary-text-primary-dark">
								<Input
									name="isShowPassword"
									id="isShowPassword"
									onChange={() =>
										setShowPassword(!isShowPassword)
									}
									type="checkbox"
									checked={isShowPassword}
									className="hidden"
								/>
								<Label
									htmlFor="isShowPassword"
									className="cursor-pointer"
								>
									{isShowPassword ? (
										<EyeOff className="w-4 h-4" />
									) : (
										<Eye className="w-4 h-4" />
									)}
								</Label>
							</span>
						</div>
						{errors.password && (
							<p className="text-red-600 text-sm">
								{errors.password}
							</p>
						)}
					</div>

					<div className="flex justify-end">
						<Link
							href="/forgot-password"
							className="text-sm text-diary-primary hover:text-diary-primary/80 transition-colors"
						>
							Quên mật khẩu?
						</Link>
					</div>
				</CardContent>

				<CardFooter className="flex flex-col space-y-4">
					<Button
						type="submit"
						className="w-full bg-diary-accent hover:bg-diary-accent/90 text-white"
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
					</Button>

					<Separator />

					<div className="flex items-center gap-2">
						<Link
							href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login/google`}
						>
							<GoogleButton
								type="dark"
								label="Đăng nhập với Google"
								onClick={() => {
									console.log('Google button clicked')
								}}
							/>
						</Link>
					</div>

					<div className="text-center text-sm text-diary-text-secondary-light dark:text-diary-text-secondary-dark">
						Chưa có tài khoản?{' '}
						<Link
							href="/register"
							className="text-diary-primary hover:text-diary-primary/80 font-medium transition-colors"
						>
							Đăng ký ngay
						</Link>
					</div>
				</CardFooter>
			</form>
		</Card>
	)
}
