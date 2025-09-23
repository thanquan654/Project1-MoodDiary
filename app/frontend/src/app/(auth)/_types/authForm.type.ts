type LoginFormValue = {
	email: string
	password: string
}

type LoginFormError = {
	email?: string
	password?: string
}

export type { LoginFormValue, LoginFormError }
