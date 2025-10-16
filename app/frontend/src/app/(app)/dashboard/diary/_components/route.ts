import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.BACKEND_URL

type RouteContext = {
	params: {
		id: string
	}
}

export async function PUT(request: NextRequest, context: RouteContext) {
	const { id } = context.params
	const formData = await request.formData()
	const url = `${BACKEND_URL}/diaries/${id}`

	const cookieStore = cookies()
	const token = (await cookieStore).get('auth_token')?.value

	if (!token) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
	}

	// Forward FormData to the backend
	// Let browser set Content-Type to multipart/form-data with boundary
	const headers = new Headers()
	headers.append('Authorization', `Bearer ${token}`)
	headers.append('ngrok-skip-browser-warning', 'true')

	try {
		// Use PUT or PATCH as your backend requires. Let's assume PUT.
		const response = await fetch(url, {
			method: 'PUT',
			headers,
			body: formData,
		})

		const data = await response.json()

		if (!response.ok) {
			return NextResponse.json(data, {
				status: response.status,
				statusText: response.statusText,
			})
		}

		return NextResponse.json(data, {
			status: response.status,
		})
	} catch (error: unknown) {
		console.error(`Error updating diary ${id}:`, error)
		const errorMessage =
			error instanceof Error ? error.message : 'Internal Server Error'
		return NextResponse.json(
			{ message: 'Error updating diary', error: errorMessage },
			{ status: 500 },
		)
	}
}
