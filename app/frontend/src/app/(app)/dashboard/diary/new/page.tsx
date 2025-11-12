import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Metadata } from 'next'
import NewDiaryForm from '../_components/NewDiaryForm'

export const metadata: Metadata = {
	title: 'Tạo nhật ký mới - Smart Diary',
	description: 'Tạo một nhật ký mới để ghi lại cảm xúc của bạn',
}

export default function NewDiaryPage() {
	return (
		<div className="min-h-screen bg-diary-bg">
			<div className="">
				<div className="max-w-4xl mx-auto p-4 lg:p-8">
					{/* Desktop Header */}
					<div className="flex items-center gap-4 mb-6">
						<Link href="/dashboard/diary">
							<Button variant="ghost" size="sm" className="p-2">
								<ArrowLeft className="h-5 w-5" />
							</Button>
						</Link>
						<h1 className="text-lg lg:text-2xl font-bold text-diary-text">
							Tạo nhật ký mới
						</h1>
					</div>

					<NewDiaryForm />
				</div>
			</div>

			{/* Bottom padding for mobile navigation */}
			<div className="h-20 lg:hidden" />
		</div>
	)
}
