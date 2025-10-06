import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const path = (await params).path.join('/')
	const searchParams = await request.nextUrl.searchParams
	const queryString = await searchParams.toString()
	const url = queryString
		? `${BACKEND_URL}/auth/${path}?${queryString}`
		: `${BACKEND_URL}/auth/${path}`

	const headers = new Headers(request.headers)
	headers.delete('connection') // Remove hop-by-hop headers
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
	} catch (error) {
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
	const body = await request.json()
	const url = `${BACKEND_URL}/auth/${path}`

	const headers = new Headers(request.headers)
	headers.delete('connection')
	headers.set('ngrok-skip-browser-warning', 'true')

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers,
			body: JSON.stringify(body),
		})
		const data = await response.json()

		return NextResponse.json(data, {
			status: response.status,
		})
	} catch (error) {
		console.error('Error fetching diary:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		)
	}
}
