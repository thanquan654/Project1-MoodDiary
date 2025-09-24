'use client'

import type React from 'react'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ResetPasswordTokenInvalidCard from '@/app/(auth)/_components/ResetPasswordTokenInvalidCard'
import ResetPasswordSuccessCard from '@/app/(auth)/_components/ResetPasswordSuccessCard'
import ResetPasswordForm from '@/app/(auth)/_components/ResetPasswordForm'
import useForm from '@/hooks/useForm'
import {
	ResetPasswordFormError,
	ResetPasswordFormValue,
} from '@/app/(auth)/_types/authForm.type'

function ResetPassword() {
	const searchParams = useSearchParams()

	const handleSubmitResetPassword = async (
		values: ResetPasswordFormValue,
	) => {
		console.log('🚀 ~ values:', values)

		//FIXME: Simulate password reset
		await new Promise((resolve) => setTimeout(resolve, 2000))

		setIsSuccess(true)
	}

	const handleValidate = (
		values: ResetPasswordFormValue,
	): ResetPasswordFormError => {
		const errors: { password?: string; confirmPassword?: string } = {}
		if (values.password !== values.confirmPassword) {
			errors.confirmPassword = 'Mật khẩu xác nhận không khớp!'
		}

		if (values.password.length < 6) {
			errors.password = 'Mật khẩu phải có ít nhất 6 ký tự!'
		}

		return errors
	}

	const {
		values,
		errors,
		isLoading,
		handleChange,
		handleSubmit,
	}: {
		values: ResetPasswordFormValue
		errors: ResetPasswordFormError
		isLoading: boolean
		handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
		handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
	} = useForm(
		{
			password: '',
			confirmPassword: '',
		},
		handleValidate,
		handleSubmitResetPassword,
	)
	const [isSuccess, setIsSuccess] = useState(false)
	const [isValidToken, setIsValidToken] = useState(true)

	const token = searchParams.get('token')

	useEffect(() => {
		//FIXME: Simulate token validation
		if (!token) {
			setIsValidToken(false)
		}
	}, [token])

	if (!isValidToken) {
		return (
			<div className="min-h-screen bg-diary-bg-light dark:bg-diary-bg-dark flex items-center justify-center p-4">
				<ResetPasswordTokenInvalidCard />
			</div>
		)
	}

	if (isSuccess) {
		return (
			<div className="min-h-screen bg-diary-bg-light dark:bg-diary-bg-dark flex items-center justify-center p-4">
				<ResetPasswordSuccessCard />
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-diary-bg-light dark:bg-diary-bg-dark flex items-center justify-center p-4">
			<ResetPasswordForm
				formData={values}
				errors={errors}
				handleInputChange={handleChange}
				handleSubmit={handleSubmit}
				isLoading={isLoading}
			/>
		</div>
	)
}

export default function ResetPasswordPage() {
	return (
		<Suspense>
			<ResetPassword />
		</Suspense>
	)
}
