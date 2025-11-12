import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	allowedDevOrigins: ['real-unlikely-mastiff.ngrok-free.app'],
	images: {
		remotePatterns: [
			new URL('https://picsum.photos/**/**'),
			new URL('https://res.cloudinary.com/dmyrfnxfv/image/**/**'),
		],
	},
}

export default nextConfig
