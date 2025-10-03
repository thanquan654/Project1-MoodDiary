'use client'

import { User, BookOpen, Moon, Sun, Home, List } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
	const { toggleTheme, theme } = useTheme()
	const pathname = usePathname()

	const getActiveTab = () => {
		if (pathname === '/dashboard') return 'home'
		if (pathname === '/dashboard/diary') return 'diaries'
		if (pathname === '/dashboard/user') return 'user'
		return 'home'
	}

	return (
		<div className="hidden lg:flex lg:flex-col lg:w-80 lg:bg-background lg:border-r lg:border-border">
			{/* Header */}
			<div className="p-6 border-b border-border">
				<Link href="/dashboard">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-diary-accent/80 rounded-lg flex items-center justify-center">
							<BookOpen className="w-6 h-6 text-white" />
						</div>
						<h1 className="text-xl font-semibold text-foreground">
							MoodDiary
						</h1>
					</div>
				</Link>
			</div>

			{/* Main Navigation */}
			<div className="flex flex-col px-6 py-2 gap-2">
				<Button
					asChild
					variant="ghost"
					className="w-full justify-start hover:bg-diary-primary/20"
				>
					<Link href="/dashboard">
						<Home className="w-4 h-4 mr-2" />
						Dashboard
					</Link>
				</Button>
				<Button
					asChild
					variant="ghost"
					className="w-full justify-start hover:bg-diary-primary/20"
				>
					<Link href="/dashboard/diary">
						<List className="w-5 h-5 mr-2" />
						Danh sách nhật ký
					</Link>
				</Button>
			</div>

			{/* Diary List */}
			{getActiveTab() !== 'diaries' ? (
				<div className="flex-1 p-6 overflow-y-auto border-t border-border">
					Diary list
				</div>
			) : (
				<div className="flex-1 p-6 overflow-y-auto">Carlendar</div>
			)}

			{/* Bottom Section */}
			<div className="p-6 border-t border-border">
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-3 p-3 rounded-lg hover:bg-diary-primary/20 cursor-pointer transition-colors flex-1">
						<div className="w-10 h-10 bg-diary-accent rounded-full flex items-center justify-center">
							<User className="w-5 h-5 text-white" />
						</div>
						<Link href="/dashboard/user" className="flex-1 ">
							<p className="text-sm font-medium text-foreground">
								Người dùng
							</p>
							<p className="text-xs text-muted-foreground">
								Xem hồ sơ
							</p>
						</Link>
					</div>
					<Button
						onClick={toggleTheme}
						className="p-2 rounded-lg bg-diary-bg-light dark:bg-diary-bg-dark hover:bg-diary-bg-light/90 dark:hover:bg-diary-bg-dark/90   transition-colors"
						title={`Chuyển sang chế độ ${
							theme === 'light' ? 'tối' : 'sáng'
						}`}
					>
						{theme === 'light' ? (
							<Moon className="w-5 h-5 text-muted-foreground" />
						) : (
							<Sun className="w-5 h-5 text-muted-foreground" />
						)}
					</Button>
				</div>
			</div>
		</div>
	)
}
