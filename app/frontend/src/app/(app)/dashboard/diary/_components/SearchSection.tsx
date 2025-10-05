'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ChevronDownIcon, Search, SearchIcon } from 'lucide-react'
import { useState } from 'react'

export default function SearchSection() {
	const [searchText, setSearchText] = useState('')
	const [openStartDate, setOpenStartDate] = useState(false)
	const [startDate, setStartDate] = useState<Date | undefined>(undefined)
	const [openEndDate, setOpenEndDate] = useState(false)
	const [endDate, setEndDate] = useState<Date | undefined>(undefined)
	const [emotionFilter, setEmotionFilter] = useState('')

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-3">
				<div className="flex-1 relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<input
						type="text"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						placeholder="Tìm kiếm nhật ký..."
						className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-diary-primary/20 focus:border-diary-primary"
					/>
				</div>
				<button
					className="p-3 bg-muted/50 border border-border rounded-lg hover:bg-muted transition-colors"
					onClick={() => {}}
				>
					<SearchIcon className="w-4 h-4 text-muted-foreground" />
				</button>
			</div>

			{/* Filter */}
			<div className="flex gap-2">
				{/* Date Picker */}
				<div className="flex gap-2">
					<Popover
						open={openStartDate}
						onOpenChange={setOpenStartDate}
					>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								id="date"
								className="w-32 justify-between font-normal"
							>
								{startDate
									? startDate.toLocaleDateString()
									: 'Từ ngày'}
								<ChevronDownIcon />
							</Button>
						</PopoverTrigger>
						<PopoverContent
							className="w-auto overflow-hidden p-0"
							align="start"
						>
							<Calendar
								mode="single"
								selected={startDate}
								captionLayout="dropdown"
								onSelect={(date) => {
									setStartDate(date)
									setOpenStartDate(false)
									// TODO: Implement date search
								}}
							/>
						</PopoverContent>
					</Popover>
				</div>
				<div className="flex gap-2">
					<Popover open={openEndDate} onOpenChange={setOpenEndDate}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								id="date"
								className="w-32 justify-between font-normal"
							>
								{endDate
									? endDate.toLocaleDateString()
									: 'Đến ngày'}
								<ChevronDownIcon />
							</Button>
						</PopoverTrigger>
						<PopoverContent
							className="w-auto overflow-hidden p-0"
							align="start"
						>
							<Calendar
								mode="single"
								selected={endDate}
								captionLayout="dropdown"
								onSelect={(date) => {
									setEndDate(date)
									setOpenEndDate(false)
									// TODO: Implement date search
								}}
							/>
						</PopoverContent>
					</Popover>
				</div>

				<Separator orientation="vertical" className="h-9" />

				{/* Mood Picker */}
				<Select value={emotionFilter} onValueChange={setEmotionFilter}>
					<SelectTrigger className="w-36">
						<SelectValue placeholder="Cảm xúc" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="all">Tất cả</SelectItem>
							<SelectItem value="happy">😄 Vui vẻ</SelectItem>
							<SelectItem value="anxious">😑 Lo lắng</SelectItem>
							<SelectItem value="sad">🥲 Buồn</SelectItem>
							<SelectItem value="angry">😡 Tức giận</SelectItem>
							<SelectItem value="neutral">
								😐 Trung tính
							</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		</div>
	)
}
