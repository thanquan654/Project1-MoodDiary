export default function DiaryDetailLoading() {
	return (
		<div className="min-h-screen bg-background">
			<div className="flex">
				<div className="flex-1 lg:p-8">
					<div className="max-w-4xl mx-auto">
						<div className="bg-card rounded-2xl border border-border overflow-hidden">
							<div className="p-6 border-b border-border animate-pulse">
								<div className="h-8 bg-muted rounded-md w-3/4 mb-4"></div>
								<div className="flex gap-4">
									<div className="h-4 bg-muted rounded w-24"></div>
									<div className="h-4 bg-muted rounded w-24"></div>
								</div>
							</div>
							<div className="p-6 space-y-4 animate-pulse">
								<div className="h-4 bg-muted rounded w-full"></div>
								<div className="h-4 bg-muted rounded w-5/6"></div>
								<div className="h-4 bg-muted rounded w-4/6"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
