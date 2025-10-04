import BottomNavigation from '@/app/(app)/_components/BottomNavigation'
import Sidebar from '@/app/(app)/_components/Sidebar'
import Loading from '@/app/(app)/loading'
import { AuthGuard } from '@/components/AuthGuard'
import { Suspense } from 'react'

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<AuthGuard>
			<div className="flex h-screen bg-diary-bg-light dark:bg-diary-bg-dark transition-colors">
				<Sidebar />

				<div className="flex-1 flex flex-col">
					<Suspense fallback={<Loading />}>
						<main className="flex-1 overflow-auto">{children}</main>
					</Suspense>
				</div>

				<div className="lg:hidden">
					<BottomNavigation />
				</div>
			</div>
		</AuthGuard>
	)
}
