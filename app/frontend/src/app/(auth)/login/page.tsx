'use client'

import LoginForm from '@/app/(auth)/_components/LoginForm'
import type {
	LoginFormError,
	LoginFormValue,
} from '@/app/(auth)/_types/authForm.type'
import useForm from '@/hooks/useForm'
import React from 'react'

export default function LoginPage() {
	const validateLoginForm = (values: LoginFormValue) => {
		console.log(values)
	}

	const loginUser = async (values: LoginFormValue) => {
		console.log(values)
	}

	const {
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
	} = useForm(
		{
			email: 'qbD1M@example.com',
			password: '123456',
		},
		validateLoginForm,
		loginUser,
	)

	return (
		<div className="min-h-screen bg-diary-bg-light dark:bg-diary-bg-dark flex items-center justify-center p-4">
			<LoginForm
				values={values}
				errors={errors}
				isSubmitting={isSubmitting}
				handleChange={handleChange}
				handleSubmit={handleSubmit}
			/>
		</div>
	)
}
