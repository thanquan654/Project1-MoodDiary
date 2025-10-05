const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
const token = localStorage.getItem('user_token')

const getDiarysListApi = async () => {
	try {
		// const respone = await fetch(`${BASE_URL}/diaries`, {
		// 	method: 'GET',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		Authorization: `Bearer ${token}`,
		// 		'ngrok-skip-browser-warning': 'true',
		// 	},
		// })

		// return respone
		// FIXME: Enable this when backend is ready
		return {
			message: 'Lấy danh sách nhật ký thành công',
			data: [
				{
					id: 31,
					title: 'Ngày đầu tiên ở Đà Lạt',
					content:
						'Hôm nay là ngày đầu tiên của chuyến đi Đà Lạt. Không khí ở đây thật trong lành và se lạnh, khác hẳn với Sài Gòn ồn ào. Buổi sáng đi dạo quanh Hồ Xuân Hương, chiều thì ghé quán cà phê Tùng ngồi ngắm người qua lại. Cảm thấy thật bình yên.',
					advice: 'Hãy tận hưởng trọn vẹn từng khoảnh khắc của chuyến đi nhé. Đừng quên thử món bánh tráng nướng!',
					emotion: 'Bình yên',
					media: [
						{
							id: 51,
							mediaUrl:
								'https://picsum.photos/seed/dalat_lake/800/600',
						},
					],
					createdAt: '2025-10-15T08:30:15.123Z',
					updatedAt: null,
				},
				{
					id: 30,
					title: 'Ngày đầu tiên ở Đà Lạt',
					content:
						'Hôm nay là ngày đầu tiên của chuyến đi Đà Lạt. Không khí ở đây thật trong lành và se lạnh, khác hẳn với Sài Gòn ồn ào. Buổi sáng đi dạo quanh Hồ Xuân Hương, chiều thì ghé quán cà phê Tùng ngồi ngắm người qua lại. Cảm thấy thật bình yên.',
					advice: 'Hãy tận hưởng trọn vẹn từng khoảnh khắc của chuyến đi nhé. Đừng quên thử món bánh tráng nướng!',
					emotion: 'Bình yên',
					media: [
						{
							id: 51,
							mediaUrl:
								'https://picsum.photos/seed/dalat_lake/800/600',
						},
					],
					createdAt: '2025-10-15T08:30:15.123Z',
					updatedAt: null,
				},
				{
					id: 29,
					title: 'Một ngày dài ở công ty',
					content:
						'Deadline dự án đang đến gần, mọi thứ thật hỗn loạn. Có một bug khó mãi không giải quyết được. Cảm thấy hơi stress và mệt mỏi. Hy vọng ngày mai mọi chuyện sẽ ổn hơn.',
					advice: 'Bạn đã làm rất tốt rồi. Hãy hít thở sâu, nghỉ ngơi một chút và quay lại vấn đề với một góc nhìn mới vào ngày mai.',
					emotion: 'Lo lắng',
					media: [],
					createdAt: '2025-10-12T18:45:00.510Z',
					updatedAt: '2025-10-12T19:05:20.600Z',
				},
				{
					id: 28,
					title: 'Buổi hẹn hò bất ngờ!',
					content:
						'Anh ấy bất ngờ xuất hiện trước cửa nhà với một bó hoa cúc họa mi. Chúng mình đã cùng nhau đi xem một bộ phim rất hay và ăn tối ở một nhà hàng lãng mạn. Một ngày thật sự hạnh phúc!',
					advice: 'Thật tuyệt vời! Hãy lưu giữ những kỷ niệm đẹp này nhé.',
					emotion: 'Vui vẻ',
					media: [
						{
							id: 49,
							mediaUrl:
								'https://picsum.photos/seed/couple_dinner/800/600',
						},
						{
							id: 50,
							mediaUrl:
								'https://picsum.photos/seed/flower_gift/800/600',
						},
					],
					createdAt: '2025-10-10T22:10:05.333Z',
					updatedAt: null,
				},
				{
					id: 27,
					title: 'Cuốn sách mới',
					content:
						"Vừa đọc xong cuốn 'Nhà Giả Kim'. Một câu chuyện nhẹ nhàng nhưng đầy ý nghĩa về việc theo đuổi ước mơ. Có lẽ mình cũng nên can đảm hơn trên con đường đã chọn.",
					advice: 'Đôi khi một cuốn sách hay có thể thay đổi cả góc nhìn của chúng ta về cuộc sống.',
					emotion: 'Trầm tư',
					media: [],
					createdAt: '2025-10-08T15:00:43.987Z',
					updatedAt: null,
				},
				{
					id: 26,
					title: 'Suy nghĩ miên man ngày cuối tuần',
					content:
						'Yêu e nhất trên đời hehee. Chiều nay trời mưa, ngồi một mình lại suy nghĩ về nhiều chuyện đã qua. Đôi khi chỉ cần những khoảnh khắc tĩnh lặng như thế này thôi.',
					advice: 'Những lúc trầm tư giúp chúng ta hiểu rõ hơn về bản thân. Hãy cho phép mình được yếu đuối đôi chút.',
					emotion: 'Buồn nhẹ',
					media: [
						{
							id: 44,
							mediaUrl:
								'https://res.cloudinary.com/dmyrfnxfv/image/upload/v1759555142/diary_images/diary_1759555141611.jpg',
						},
					],
					createdAt: '2025-10-04T12:19:03.271Z',
					updatedAt: '2025-10-04T15:20:11.100Z',
				},
				{
					id: 25,
					title: 'Chuyện không vui',
					content:
						'Hôm nay đã có một cuộc cãi vã không đáng có với người bạn thân. Cả hai đều nóng giận và nói những lời làm tổn thương nhau. Giờ cảm thấy rất hối hận.',
					advice: 'Tình bạn chân thành luôn xứng đáng có cơ hội thứ hai. Khi cả hai đã bình tĩnh, hãy thử bắt chuyện lại nhé.',
					emotion: 'Tức giận',
					media: [],
					createdAt: '2025-10-02T11:00:33.748Z',
					updatedAt: null,
				},
			],
		}
	} catch (error) {
		console.log(error)
	}
}

export { getDiarysListApi }
