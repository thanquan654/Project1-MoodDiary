'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import { useRouter, useSearchParams } from 'next/navigation' // Import hooks
import { useState } from 'react'

export default function SearchSection() {
	const router = useRouter()
	const searchParams = useSearchParams()

	// State nội bộ để quản lý input, nhưng giá trị thật sự đến từ URL
	const [searchText, setSearchText] = useState(
		searchParams.get('keyword') || '',
	)
	const [startDate, setStartDate] = useState<Date | undefined>(
		searchParams.get('fromDate')
			? new Date(searchParams.get('fromDate')!)
			: undefined,
	)
	const [endDate, setEndDate] = useState<Date | undefined>(
		searchParams.get('toDate')
			? new Date(searchParams.get('toDate')!)
			: undefined,
	)
	const [emotionFilter, setEmotionFilter] = useState(
		searchParams.get('emotion') || '',
	)

	const [openStartDate, setOpenStartDate] = useState(false)
	const [openEndDate, setOpenEndDate] = useState(false)

	// Hàm helper để cập nhật URL
	const updateQueryParams = (paramsToUpdate: Record<string, string>) => {
		const currentParams = new URLSearchParams(
			Array.from(searchParams.entries()),
		)

		Object.entries(paramsToUpdate).forEach(([key, value]) => {
			if (value) {
				currentParams.set(key, value)
			} else {
				currentParams.delete(key)
			}
		})

		router.push(`/dashboard/diary?${currentParams.toString()}`)
	}

	const handleSearchClick = () => {
		updateQueryParams({ keyword: searchText })
	}

	const handleDateSelect = (
		type: 'start' | 'end',
		date: Date | undefined,
	) => {
		const newStartDate = type === 'start' ? date : startDate
		const newEndDate = type === 'end' ? date : endDate
		setStartDate(newStartDate)
		setEndDate(newEndDate)
		updateQueryParams({
			fromDate: newStartDate
				? newStartDate.toISOString().split('T')[0]
				: '',
			toDate: newEndDate ? newEndDate.toISOString().split('T')[0] : '',
		})
	}

	const handleEmotionChange = (value: string) => {
		setEmotionFilter(value)
		updateQueryParams({ emotion: value === 'all' ? '' : value })
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-3">
				<div className="flex-1 relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<input
						type="text"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						onKeyDown={(e) =>
							e.key === 'Enter' && handleSearchClick()
						} // Thêm tìm kiếm bằng Enter
						placeholder="Tìm kiếm nhật ký..."
						className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-diary-primary/20 focus:border-diary-primary"
					/>
				</div>
				<button
					className="p-3 bg-muted/50 border border-border rounded-lg hover:bg-muted transition-colors"
					onClick={handleSearchClick} // Cập nhật onClick
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
									handleDateSelect('start', date)
									setOpenStartDate(false)
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
									handleDateSelect('end', date)
									setOpenEndDate(false)
								}}
							/>
						</PopoverContent>
					</Popover>
				</div>

				<Separator orientation="vertical" className="h-9" />

				{/* Mood Picker */}
				<Select
					value={emotionFilter}
					onValueChange={handleEmotionChange}
				>
					<SelectTrigger className="w-36">
						<SelectValue placeholder="Cảm xúc" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="all">Tất cả</SelectItem>
							<SelectItem value="Vui">😄 Vui vẻ</SelectItem>
							<SelectItem value="Lo Lắng">😑 Lo lắng</SelectItem>
							<SelectItem value="Buồn">🥲 Buồn</SelectItem>
							<SelectItem value="Tức giận">
								😡 Tức giận
							</SelectItem>
							<SelectItem value="Trung tính">
								😐 Trung tính
							</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		</div>
	)
}
