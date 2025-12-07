import React from 'react'
import {
	Leaf,
	Wind,
	MessageCircleHeart,
	Lock,
	BarChart3,
	PenLine,
	ArrowRight,
	UserCircle2,
	BrainCircuit,
	Smile,
} from 'lucide-react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
	const cookieStore = cookies()
	const token = (await cookieStore).get('user_token')

	if (token) {
		redirect('/dashboard')
	}

	return (
		<div className="min-h-screen bg-diary-bg-light text-diary-text-light font-sans selection:bg-diary-accent selection:text-white overflow-x-hidden">
			{/* --- INJECT CSS ANIMATIONS --- */}
			<style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        /* Smooth scrolling */
        html { scroll-behavior: smooth; }
      `}</style>

			{/* --- NAVIGATION --- */}
			<nav className="fixed top-0 w-full z-50 bg-[#fcfcfa]/80 backdrop-blur-md border-b border-[#6b8e23]/10">
				<div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
					<div className="flex items-center gap-2 group cursor-pointer">
						<div className="bg-[#6b8e23] p-2 rounded-xl text-white group-hover:rotate-12 transition-transform duration-300">
							<Leaf size={24} />
						</div>
						<span className="text-xl font-serif font-bold text-[#4a4a4a]">
							<span className="text-[#6b8e23]">MoodDiary</span>
						</span>
					</div>

					<div className="hidden md:flex items-center gap-8 font-medium">
						<a
							href="#tinh-nang"
							className="hover:text-[#6b8e23] transition-colors"
						>
							Tính năng
						</a>
						<a
							href="#loi-ich"
							className="hover:text-[#6b8e23] transition-colors"
						>
							Lợi ích
						</a>
					</div>

					<a
						href="/login"
						className="group relative px-6 py-2.5 rounded-full bg-[#2d2c2a] text-[#fcfcfa] font-semibold overflow-hidden transition-all hover:shadow-lg hover:shadow-[#6b8e23]/20"
					>
						<span className="relative z-10 flex items-center gap-2">
							Đăng nhập{' '}
							<ArrowRight
								size={16}
								className="group-hover:translate-x-1 transition-transform"
							/>
						</span>
						<div className="absolute inset-0 bg-[#6b8e23] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
					</a>
				</div>
			</nav>

			{/* --- HERO SECTION --- */}
			<section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
				{/* Abstract Background blobs */}
				<div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
					<div className="absolute top-0 left-1/4 w-72 h-72 bg-[#6b8e23] rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
					<div className="absolute top-0 right-1/4 w-72 h-72 bg-[#e9967a] rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
					<div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-[#e9967a]/50 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
				</div>

				<div className="max-w-4xl mx-auto text-center animate-fade-in">
					<span className="inline-block py-1 px-3 rounded-full bg-[#e9967a]/10 text-[#e9967a] text-sm font-semibold tracking-wide mb-6">
						✨ Trợ lý cảm xúc thông minh của bạn
					</span>
					<h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6 text-[#2d2c2a]">
						Đừng để cảm xúc <br /> trôi đi trong{' '}
						<span className="text-[#6b8e23] italic relative">
							im lặng
							<svg
								className="absolute w-full h-3 -bottom-1 left-0 text-[#e9967a]"
								viewBox="0 0 100 10"
								preserveAspectRatio="none"
							>
								<path
									d="M0 5 Q 50 10 100 5"
									stroke="currentColor"
									strokeWidth="3"
									fill="none"
								/>
							</svg>
						</span>
						.
					</h1>
					<p className="text-xl text-[#4a4a4a]/80 mb-10 max-w-2xl mx-auto leading-relaxed">
						Hơn cả một cuốn nhật ký. Một không gian chữa lành nơi AI
						thấu hiểu, lắng nghe và giúp bạn gọi tên những cảm xúc
						ẩn giấu.
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<a
							href="/register"
							className="px-8 py-4 bg-[#6b8e23] text-white rounded-full font-bold text-lg hover:bg-[#5a7a1c] transition-colors shadow-lg shadow-[#6b8e23]/30 hover:scale-105 transform duration-200"
						>
							Bắt đầu hành trình ngay
						</a>
					</div>

					{/* Simple Dashboard Mockup */}
					<div className="mt-16 relative mx-auto max-w-5xl animate-float">
						<div className="relative z-10 bg-white/80 backdrop-blur rounded-2xl shadow-2xl border border-white p-4">
							<div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
								<div className="w-3 h-3 rounded-full bg-red-400"></div>
								<div className="w-3 h-3 rounded-full bg-yellow-400"></div>
								<div className="w-3 h-3 rounded-full bg-green-400"></div>
							</div>
							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-[#fcfcfa] p-4 rounded-xl border border-dashed border-[#d1d1d1]">
									<p className="text-sm text-[#e9967a] font-bold mb-2">
										Hôm nay, 20:00
									</p>
									<p className="italic text-gray-600">
										&quot;Hôm nay mình thấy hơi mệt mỏi vì
										công việc không như ý...&quot;
									</p>
								</div>
								<div className="bg-[#6b8e23]/10 p-4 rounded-xl border border-[#6b8e23]/20 relative">
									<div className="absolute -top-3 -right-3 bg-[#6b8e23] text-white p-1.5 rounded-full shadow-sm">
										<BrainCircuit size={16} />
									</div>
									<p className="text-sm font-semibold text-[#6b8e23] mb-1">
										AI Phản hồi:
									</p>
									<p className="text-sm text-[#4a4a4a]">
										Chào bạn, có vẻ như bạn đang chịu nhiều
										áp lực. Hãy thử hít thở sâu nhé, mọi
										chuyện rồi sẽ ổn thôi...
									</p>
								</div>
							</div>
						</div>
						{/* Decor elements */}
						<div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#e9967a] rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>
					</div>
				</div>
			</section>

			{/* --- PROBLEM SECTION (DARK) --- */}
			<section id="loi-ich" className="py-24 bg-[#2d2c2a] text-[#d1d1d1]">
				<div className="max-w-7xl mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-serif font-bold text-[#fcfcfa] mb-4">
							Bạn có đang cảm thấy...
						</h2>
						<div className="w-20 h-1 bg-[#e9967a] mx-auto rounded-full"></div>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{[
							{
								icon: (
									<Wind
										size={40}
										className="text-[#e9967a]"
									/>
								),
								title: 'Áp lực vô hình',
								desc: 'Giữa vòng xoáy deadline và kỳ vọng, bạn kiệt sức nhưng không biết chia sẻ cùng ai.',
							},
							{
								icon: (
									<Lock
										size={40}
										className="text-[#e9967a]"
									/>
								),
								title: 'Khó mở lòng',
								desc: 'Muốn viết ra những suy nghĩ sâu kín nhưng sợ bị phán xét hoặc thiếu riêng tư.',
							},
							{
								icon: (
									<Smile
										size={40}
										className="text-[#e9967a]"
									/>
								),
								title: 'Mất kết nối',
								desc: 'Bạn hiểu cả thế giới, nhưng đôi khi lại quên mất cách hiểu chính cảm xúc của mình.',
							},
						].map((item, idx) => (
							<div
								key={idx}
								className="group p-8 rounded-2xl bg-[#fcfcfa]/5 hover:bg-[#fcfcfa]/10 border border-[#fcfcfa]/10 hover:border-[#e9967a]/50 transition-all duration-300 hover:-translate-y-2"
							>
								<div className="mb-6 p-4 inline-block rounded-full bg-[#2d2c2a] shadow-inner shadow-[#000]">
									{item.icon}
								</div>
								<h3 className="text-xl font-bold text-[#fcfcfa] mb-3">
									{item.title}
								</h3>
								<p className="leading-relaxed">{item.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* --- SOLUTION / FEATURES SECTION --- */}
			<section id="tinh-nang" className="py-24 px-6 overflow-hidden">
				<div className="max-w-7xl mx-auto space-y-24">
					{/* Feature 1: AI Analysis */}
					<div className="flex flex-col md:flex-row items-center gap-12 group">
						<div className="flex-1 order-2 md:order-1 relative">
							<div className="absolute inset-0 bg-[#6b8e23] rounded-full filter blur-3xl opacity-20 transform group-hover:scale-110 transition-transform duration-700"></div>
							<div className="relative bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
								<div className="flex gap-4 mb-4">
									<div className="bg-gray-100 p-3 rounded-t-xl rounded-br-xl rounded-bl-none max-w-[80%]">
										<p className="text-sm text-gray-600">
											Tôi cảm thấy rất buồn vì không ai
											hiểu mình.
										</p>
									</div>
								</div>
								<div className="flex gap-4 justify-end">
									<div className="bg-[#6b8e23]/10 p-3 rounded-t-xl rounded-bl-xl rounded-br-none max-w-[90%]">
										<p className="text-sm text-[#4a4a4a]">
											<span className="font-bold text-[#6b8e23] block mb-1 flex items-center gap-1">
												<BrainCircuit size={12} /> AI
												Phân tích
											</span>
											Mình cảm nhận được sự cô đơn trong
											lời nói của bạn. Cảm xúc này hoàn
											toàn hợp lý. Bạn có muốn viết thêm
											về điều gì khiến bạn thấy xa cách
											nhất không?
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="flex-1 order-1 md:order-2 space-y-6">
							<div className="w-12 h-12 bg-[#6b8e23] rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-[#6b8e23]/30">
								<MessageCircleHeart />
							</div>
							<h3 className="text-3xl md:text-4xl font-serif font-bold text-[#2d2c2a]">
								AI Thấu Cảm & <br /> Trò Chuyện
							</h3>
							<p className="text-lg text-[#4a4a4a]/80 leading-relaxed">
								Không chỉ là nơi lưu trữ. Hệ thống AI của chúng
								tôi phân tích sắc thái ngôn từ, gọi tên cảm xúc
								và đưa ra lời khuyên vỗ về đúng lúc như một
								người bạn tri kỷ.
							</p>
							<ul className="space-y-3">
								{[
									'Phân tích cảm xúc tự động',
									'Gợi ý lời khuyên tâm lý',
									'Chatbot bầu bạn 24/7',
								].map((item) => (
									<li
										key={item}
										className="flex items-center gap-3 text-[#4a4a4a] font-medium"
									>
										<div className="w-2 h-2 rounded-full bg-[#e9967a]"></div>{' '}
										{item}
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Feature 2: Visual Stats */}
					<div className="flex flex-col md:flex-row items-center gap-12 group">
						<div className="flex-1 space-y-6">
							<div className="w-12 h-12 bg-[#e9967a] rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-[#e9967a]/30">
								<BarChart3 />
							</div>
							<h3 className="text-3xl md:text-4xl font-serif font-bold text-[#2d2c2a]">
								Nhìn Lại Để <br /> Trưởng Thành
							</h3>
							<p className="text-lg text-[#4a4a4a]/80 leading-relaxed">
								Theo dõi biểu đồ tâm trạng qua các tuần. Nhận
								diện những yếu tố (&quot;triggers&quot;) khiến
								bạn vui vẻ hoặc lo âu để điều chỉnh lối sống
								tích cực hơn.
							</p>
						</div>
						<div className="flex-1 relative">
							{/* Decorative calendar */}
							<div className="bg-[#2d2c2a] p-8 rounded-3xl shadow-2xl relative overflow-hidden group-hover:-translate-y-2 transition-transform duration-500">
								<div className="flex justify-between items-center mb-4">
									<h4 className="font-bold text-lg text-white">
										Tháng 7
									</h4>
									<div className="text-xs text-gray-400">
										2025
									</div>
								</div>
								<div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-400 mb-2">
									{[
										'T2',
										'T3',
										'T4',
										'T5',
										'T6',
										'T7',
										'CN',
									].map((day) => (
										<div key={day}>{day}</div>
									))}
								</div>
								<div className="grid grid-cols-7 place-items-center gap-y-2 text-sm text-gray-400">
									{/* July 2024 starts on a Monday */}
									<div>1</div> <div>2</div> <div>3</div>{' '}
									<div>4</div> <div>5</div> <div>6</div>
									<div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#e9967a]/70 text-white">
										7
									</div>
									<div>8</div> <div>9</div> <div>10</div>{' '}
									<div>11</div>
									<div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white ring-1 ring-white/50">
										12
									</div>
									<div>13</div>
									<div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#6b8e23]/70 text-white">
										14
									</div>
									<div>15</div> <div>16</div> <div>17</div>{' '}
									<div>18</div> <div>19</div> <div>20</div>{' '}
									<div>21</div>
									<div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#e9967a]/70 text-white">
										22
									</div>
									<div>23</div> <div>24</div> <div>25</div>{' '}
									<div>26</div> <div>27</div> <div>28</div>
									<div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#6b8e23]/70 text-white">
										29
									</div>
									<div>30</div> <div>31</div>
								</div>
							</div>
						</div>
					</div>

					{/* Feature 3: Multi-format */}
					<div className="flex flex-col md:flex-row items-center gap-12">
						<div className="flex-1 order-2 md:order-1 grid grid-cols-2 gap-4">
							<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:border-[#6b8e23] transition-colors">
								<PenLine
									className="text-[#6b8e23] mb-3"
									size={32}
								/>
								<span className="font-bold text-[#2d2c2a]">
									Nhật ký văn bản
								</span>
							</div>
							<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:border-[#e9967a] transition-colors">
								<div className="mb-3 text-[#e9967a]">🎙️</div>
								<span className="font-bold text-[#2d2c2a]">
									Voice-to-Text
								</span>
							</div>
							<div className="col-span-2 bg-[#fcfcfa] p-6 rounded-2xl border border-dashed border-[#d1d1d1] flex items-center justify-center gap-4">
								<span className="text-2xl grayscale hover:grayscale-0 transition-all cursor-pointer">
									😊
								</span>
								<span className="text-2xl grayscale hover:grayscale-0 transition-all cursor-pointer">
									😢
								</span>
								<span className="text-2xl grayscale hover:grayscale-0 transition-all cursor-pointer">
									😡
								</span>
								<span className="text-sm font-medium text-gray-500">
									Check-in nhanh
								</span>
							</div>
						</div>
						<div className="flex-1 order-1 md:order-2 space-y-6">
							<div className="w-12 h-12 bg-[#2d2c2a] rounded-xl flex items-center justify-center text-white mb-4">
								<Leaf />
							</div>
							<h3 className="text-3xl md:text-4xl font-serif font-bold text-[#2d2c2a]">
								Ghi Lại Theo <br /> Cách Của Bạn
							</h3>
							<p className="text-lg text-[#4a4a4a]/80 leading-relaxed">
								Lười gõ phím? Hãy dùng giọng nói. Không biết
								viết gì? Hãy trả lời câu hỏi gợi mở mỗi ngày
								(Daily Prompt). Tự do thể hiện bản thân không
								giới hạn.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* --- CTA SECTION --- */}
			<section className="py-20 px-6">
				<div className="max-w-5xl mx-auto bg-[#6b8e23] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
					{/* Decorative Circles */}
					<div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
					<div className="absolute bottom-0 right-0 w-64 h-64 bg-[#e9967a] opacity-20 rounded-full translate-x-1/2 translate-y-1/2"></div>

					<h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 relative z-10">
						Sẵn sàng chăm sóc <br /> khu vườn tâm trí của bạn?
					</h2>
					<p className="text-white/90 text-lg mb-10 max-w-xl mx-auto relative z-10">
						Hãy để chúng tôi đồng hành cùng bạn trên con đường thấu
						hiểu bản thân và tìm lại sự cân bằng.
					</p>
					<div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="/register"
							className="px-8 py-4 bg-[#fcfcfa] text-[#6b8e23] rounded-full font-bold text-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
						>
							Tạo tài khoản miễn phí
						</a>
					</div>
				</div>
			</section>

			{/* --- FOOTER --- */}
			<footer className="bg-[#2d2c2a] text-[#d1d1d1] pt-16 pb-8 border-t border-[#4a4a4a]/30">
				<div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10 mb-12">
					<div className="col-span-1 md:col-span-2">
						<div className="flex items-center gap-2 mb-6">
							<Leaf className="text-[#6b8e23]" />
							<span className="text-2xl font-serif font-bold text-[#fcfcfa]">
								MindJournal.AI
							</span>
						</div>
						<p className="text-sm leading-relaxed opacity-70 max-w-xs">
							Dự án nhật ký cảm xúc thông minh ứng dụng AI, giúp
							thế hệ trẻ Việt Nam chăm sóc sức khỏe tinh thần một
							cách chủ động và hiệu quả.
						</p>
					</div>

					<div>
						<h4 className="text-[#fcfcfa] font-bold mb-4">
							Khám phá
						</h4>
						<ul className="space-y-2 text-sm opacity-70">
							<li>
								<a
									href="#"
									className="hover:text-[#e9967a] transition-colors"
								>
									Về chúng tôi
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-[#e9967a] transition-colors"
								>
									Tính năng AI
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-[#e9967a] transition-colors"
								>
									Blog sức khỏe
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="text-[#fcfcfa] font-bold mb-4">
							Hỗ trợ
						</h4>
						<ul className="space-y-2 text-sm opacity-70">
							<li>
								<a
									href="#"
									className="hover:text-[#e9967a] transition-colors"
								>
									Trung tâm trợ giúp
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-[#e9967a] transition-colors"
								>
									Chính sách bảo mật
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-[#e9967a] transition-colors"
								>
									Điều khoản sử dụng
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="max-w-7xl mx-auto px-6 pt-8 border-t border-[#4a4a4a]/30 text-center text-sm opacity-50">
					© {new Date().getFullYear()} MindJournal.AI - All rights
					reserved.
				</div>
			</footer>
		</div>
	)
}
