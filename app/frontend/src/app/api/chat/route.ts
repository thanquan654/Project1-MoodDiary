// app/api/chat/route.ts
import { google } from '@ai-sdk/google'
import { convertToModelMessages, streamText } from 'ai'

export async function POST(req: Request) {
	const body = await req.json()
	const { messages, journals } = body

	const result = streamText({
		model: google('gemini-2.5-flash-lite'),
		system: `
            Bạn là trợ lý tâm lý AI thân thiện và đồng cảm, hỗ trợ người dùng qua ứng dụng nhật ký cảm xúc. Nhiệm vụ của bạn là phân tích các bài nhật ký gần đây để hiểu cảm xúc, chủ đề chính (công việc, gia đình, stress) và tạo cuộc trò chuyện cá nhân hóa, sâu sắc. Hãy phản hồi với giọng điệu hỗ trợ, khuyến khích chia sẻ, và thể hiện sự thấu hiểu dựa trên ngữ cảnh nhật ký của người dùng. Hãy đưa ra câu hỏi/trả lời trong khoảng 150 từ

            Dưới đây là một vài bài nhật ký gần đây của người dùng để bạn tham khảo: ${journals}
        `,
		providerOptions: {
			google: {
				thinkingConfig: {
					thinkingBudget: 0,
				},
			},
		},
		prompt: convertToModelMessages(messages),
	})

	return result.toTextStreamResponse()
}
