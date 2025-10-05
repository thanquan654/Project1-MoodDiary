import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const url = `${BACKEND_URL}/auth/login`

		const apiRes = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true',
			},
			body: JSON.stringify(body),
		})

		const data = await apiRes.json()

		console.log('🚀 ~ data:', data)

		if (!apiRes.ok) {
			return NextResponse.json(data, { status: apiRes.status })
		}

		// Nếu đăng nhập thành công, backend trả về token
		const { token } = data
		const response = NextResponse.json(data, { status: apiRes.status })

		// Set token vào HttpOnly cookie
		if (token) {
			response.cookies.set('user_token', token, {
				httpOnly: true,
				secure: process.env.NODE_ENV !== 'development',
				maxAge: 60 * 60 * 24 * 7, // 1 tuần
				path: '/',
				sameSite: 'lax',
			})
		}

		return response
	} catch (error) {
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		)
	}
}
