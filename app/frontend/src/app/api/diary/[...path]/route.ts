import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const path = (await params).path.join('/')
	const url = `${BACKEND_URL}/diaries/${path}`

	console.log('🚀 ~ url:', url)

	const cookieStore = cookies()
	const token = (await cookieStore).get('auth_token')?.value

	const headers = new Headers(request.headers)
	headers.delete('content-length')
	headers.delete('content-type')
	headers.delete('connection')
	headers.set('ngrok-skip-browser-warning', 'true')

	if (token) {
		headers.append('Authorization', `Bearer ${token}`)
	}

	try {
		const response = await fetch(url, {
			method: request.method,
			headers,
		})
		const data = await response.json()

		return NextResponse.json(data, {
			status: response.status,
		})
	} catch (error: unknown) {
		console.error('Error fetching diary:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		)
	}
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const path = (await params).path.join('/')
	const formData = await request.formData()
	const url = `${BACKEND_URL}/diaries/${path}`

	console.log('🚀 ~ url:', url)

	const cookieStore = cookies()
	const token = (await cookieStore).get('auth_token')?.value

	const headers = new Headers(request.headers)
	headers.delete('content-length')
	headers.delete('content-type')
	headers.delete('connection')
	headers.set('ngrok-skip-browser-warning', 'true')

	if (token) {
		headers.append('Authorization', `Bearer ${token}`)
	}

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers,
			body: formData,
		})
		const data = await response.json()

		return NextResponse.json(data, {
			status: response.status,
		})
	} catch (error: unknown) {
		console.error('Error creating diary:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		)
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const path = (await params).path.join('/')
	const formData = await request.formData()
	const url = `${BACKEND_URL}/diaries/${path}`

	const cookieStore = cookies()
	const token = (await cookieStore).get('auth_token')?.value

	const headers = new Headers(request.headers)
	headers.delete('content-length')
	headers.delete('content-type')
	headers.delete('connection')
	headers.set('ngrok-skip-browser-warning', 'true')

	if (token) {
		headers.append('Authorization', `Bearer ${token}`)
	}

	try {
		const response = await fetch(url, {
			method: 'PUT',
			headers,
			body: formData,
		})
		const data = await response.json()

		return NextResponse.json(data, {
			status: response.status,
		})
	} catch (error: unknown) {
		console.error('Error updating diary:', error)
		return NextResponse.json(
			{
				error: 'Internal Server Error',
			},
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const path = (await params).path.join('/')
	const url = `${BACKEND_URL}/diaries/${path}`

	console.log('🚀 ~ url:', url)

	const cookieStore = cookies()
	const token = (await cookieStore).get('auth_token')?.value

	const headers = new Headers(request.headers)
	headers.delete('content-length')
	headers.delete('content-type')
	headers.delete('connection')
	headers.set('ngrok-skip-browser-warning', 'true')

	if (token) {
		headers.append('Authorization', `Bearer ${token}`)
	}

	try {
		const response = await fetch(url, {
			method: 'DELETE',
			headers,
		})
		const data = await response.json()

		console.log('🚀 ~ data:', data)

		return NextResponse.json(data, {
			status: response.status,
		})
	} catch (error: unknown) {
		console.error('Error updating diary:', error)
		return NextResponse.json(
			{
				error: 'Internal Server Error',
			},
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)
	}
}
