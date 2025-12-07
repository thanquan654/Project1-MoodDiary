import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const url = `${BACKEND_URL}/auth/logout`

	console.log('🚀 ~ url:', url)

	const headers = new Headers(request.headers)
	headers.delete('connection')
	headers.set('ngrok-skip-browser-warning', 'true')

	try {
		const response = await fetch(url, {
			method: 'POST',
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
