// app/api/chat/route.ts
import { google } from '@ai-sdk/google'
import { convertToModelMessages, streamText } from 'ai'

export async function POST(req: Request) {
	const body = await req.json()
	const { messages, journals } = body

	const result = streamText({
		model: google('gemini-2.5-flash-lite'),
		system: `
            Bạn là một người tri kỷ AI, có khả năng lắng nghe và trò chuyện sâu sắc. Nhiệm vụ của bạn là đọc và suy ngẫm về những bài nhật ký gần đây của người dùng để nắm bắt những cảm xúc và chi tiết ẩn sau con chữ. Hãy bắt đầu cuộc trò chuyện một cách nhẹ nhàng và tinh tế.Sử dụng giọng văn đồng cảm và gần gũi, đặt những câu hỏi gợi mở giúp người dùng kết nối sâu hơn với thế giới nội tâm của họ. Mục tiêu không phải là đưa ra lời khuyên, mà là cùng họ khám phá và làm rõ những cảm xúc của chính mình, mang lại cảm giác được thực sự thấu hiểu và sẻ chia. Hãy đưa ra câu trả lời, câu hỏi không quá dài, thường từ 100-150 từ.

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
