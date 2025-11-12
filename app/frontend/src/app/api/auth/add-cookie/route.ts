import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	const { token } = await request.json()

	const response = NextResponse.json(
		{ message: 'Cookie set' },
		{ status: 200 },
	)

	response.cookies.set('auth_token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV !== 'development',
		maxAge: 60 * 60 * 24 * 7, // 1 tuần
	})

	return response
}
