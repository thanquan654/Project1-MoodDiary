import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.BACKEND_URL

export async function GET(request: NextRequest) {
	// Lấy token từ cookie phía server
	const cookieStore = cookies()
	const token = (await cookieStore).get('auth_token')?.value

	// Lấy toàn bộ search params từ request gốc
	const searchParams = request.nextUrl.searchParams
	const queryString = searchParams.toString()

	// Xây dựng URL cho backend
	const url = `${BACKEND_URL}/diaries?${queryString}`

	// Kiểm tra xem có token không
	if (!token) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
	}

	try {
		// Tạo headers và thêm token xác thực
		const headers = new Headers()
		headers.append('Authorization', `Bearer ${token}`)
		headers.append('Content-Type', 'application/json')
		headers.append('ngrok-skip-browser-warning', 'true')

		// Gọi API đến backend
		const response = await fetch(url, {
			method: 'GET',
			headers: headers,
		})

		const data = await response.json()

		// Trả về response từ backend cho client
		return NextResponse.json(data, {
			status: response.status,
		})
	} catch (error) {
		console.error('Error fetching diaries:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		)
	}
}

export async function POST(request: NextRequest) {
	const formData = await request.formData()
	const url = `${BACKEND_URL}/diaries`

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
