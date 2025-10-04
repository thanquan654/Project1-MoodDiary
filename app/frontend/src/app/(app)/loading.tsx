import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
	return (
		<div className="flex-1 p-8 space-y-6">
			{/* Header skeleton */}
			<div className="space-y-4">
				<Skeleton className="h-8 w-[200px]" />
				<Skeleton className="h-4 w-[300px]" />
			</div>

			{/* Content skeleton */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{[...Array(6)].map((_, i) => (
					<div key={i} className="space-y-4 p-4 border rounded-lg">
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-20" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-2/3" />
						</div>
						<div className="flex justify-between">
							<Skeleton className="h-8 w-20" />
							<Skeleton className="h-8 w-20" />
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
