import { useState } from 'react'

/**
 * @param {unknown} initialState initial state
 * @param {function} validate validation function
 * @param {function} callback callback function
 * @returns object with handleChange, handleSubmit, values, errors, isSubmitting
 */
const useForm = (initialState, validate, callback) => {
	const [values, setValues] = useState(initialState)
	const [errors, setErrors] = useState({})
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleChange = (event) => {
		const { name, value, type, checked } = event.target
		if (type === 'checkbox') {
			setValues({
				...values,
				[name]: checked,
			})
		} else {
			setValues({
				...values,
				[name]: value,
			})
		}
	}

	const handleSubmit = (event) => {
		if (event) event.preventDefault()

		const validationErrors = validate(values)
		setErrors(validationErrors)

		if (Object.keys(validationErrors).length === 0) {
			setIsSubmitting(true)
			callback()
			setIsSubmitting(false)
		}

		console.log('values', values)
	}

	return {
		handleChange,
		handleSubmit,
		values,
		errors,
		isSubmitting,
	}
}

export default useForm
