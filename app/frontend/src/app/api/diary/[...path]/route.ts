import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const path = (await params).path.join('/')
	const searchParams = request.nextUrl.searchParams
	const queryString = searchParams.toString()
	const url = queryString
		? `${BACKEND_URL}/diaries/${path}?${queryString}`
		: `${BACKEND_URL}/diaries/${path}`

	const headers = new Headers(request.headers)
	headers.delete('connection')
	headers.set('ngrok-skip-browser-warning', 'true')

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

	const headers = new Headers(request.headers)
	headers.delete('connection')
	headers.set('ngrok-skip-browser-warning', 'true')

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
