export function Header() {
	const today = new Date()
	const formattedDate = today.toLocaleDateString('vi-VN', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})

	return (
		<header className="bg-card shadow-card px-4 py-4">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl text-diary-primary">
						Nhật ký của bạn
					</h1>
					<p className="text-caption text-muted-foreground">
						{formattedDate}
					</p>
				</div>
			</div>
		</header>
	)
}

export default Header
