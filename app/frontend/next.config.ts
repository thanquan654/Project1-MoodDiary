import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	allowedDevOrigins: ['real-unlikely-mastiff.ngrok-free.app'],
	images: {
		remotePatterns: [new URL('https://picsum.photos/**/**')],
	},
}

export default nextConfig
