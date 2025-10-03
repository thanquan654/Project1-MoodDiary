'use client'

import { Home, BookOpen, User } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

const navItems = [
	{ id: 'home', label: 'Trang chủ', icon: Home, href: '/dashboard' },
	{
		id: 'diaries',
		label: 'Nhật ký',
		icon: BookOpen,
		href: '/dashboard/diary',
	},
	{ id: 'user', label: 'Cá nhân', icon: User, href: '/dashboard/user' },
]

export function BottomNavigation() {
	const router = useRouter()
	const pathname = usePathname()

	const getActiveTab = () => {
		if (pathname === '/dashboard') return 'home'
		if (pathname === '/dashboard/diary') return 'diaries'
		if (pathname === '/dashboard/user') return 'user'
		return 'home'
	}

	const activeTab = getActiveTab()

	const handleNavigation = (item: (typeof navItems)[0]) => {
		router.push(item.href)
	}

	return (
		<nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-card lg:hidden">
			<div className="flex justify-around items-center py-2">
				{navItems.map((item) => {
					const Icon = item.icon
					const isActive = activeTab === item.id

					return (
						<button
							key={item.id}
							onClick={() => handleNavigation(item)}
							className={`
                flex flex-col items-center gap-1 px-4 py-2 rounded-button
                transition-colors duration-200
                ${
					isActive
						? 'text-diary-accent'
						: 'text-muted-foreground hover:text-foreground hover:bg-muted'
				}
              `}
						>
							<Icon className="w-5 h-5" />
							<span className="text-xs font-medium">
								{item.label}
							</span>
						</button>
					)
				})}
			</div>
		</nav>
	)
}

export default BottomNavigation
