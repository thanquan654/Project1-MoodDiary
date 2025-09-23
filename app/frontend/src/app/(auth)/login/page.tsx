'use client'

import LoginForm from '@/app/(auth)/_components/LoginForm'
import type {
	LoginFormError,
	LoginFormValue,
} from '@/app/(auth)/_types/authForm.type'
import useForm from '@/hooks/useForm'
import { useUser } from '@/hooks/useUser'
import React from 'react'

export default function LoginPage() {
	const { login } = useUser()

	const validateLoginForm = (values: LoginFormValue) => {
		const errors: LoginFormError = {}
		if (!values.email) {
			errors.email = 'Vui lòng nhập email của bạn.'
		} else if (
			!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
		) {
			errors.email = 'Email không đúng định dạng. Vui lòng kiểm tra lại.'
		}
		if (!values.password) {
			errors.password = 'Vui lòng nhập mật khẩu.'
		} else if (values.password.length < 6) {
			errors.password =
				'Mật khẩu phải có ít nhất 6 ký tự. Vui lòng kiểm tra lại.'
		}
		return errors
	}

	const loginUser = async (values: LoginFormValue) => {
		await login(values.email, values.password)

		// window.location.href = '/'
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
			email: 'danhtien2k4@gmail.com',
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
