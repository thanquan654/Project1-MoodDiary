const BACKEND_URL =
	process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL

export const getChatbotMessageApi = async (token?: string) => {
	try {
		const response = await fetch(`${BACKEND_URL}/diaries/ai-chat/message`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` }),
				'ngrok-skip-browser-warning': 'true',
			},
		})

		if (!response.ok) {
			console.error(`API call failed with status: ${response.status}`)
		}

		const data = await response.json()

		return data
	} catch (error) {
		console.error('Error get quick check-in data:', error)
		throw error
	}
}

export const getChatbotContextApi = async (token?: string) => {
	try {
		const response = await fetch(`${BACKEND_URL}/diaries/ai-chat/start`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` }),
				'ngrok-skip-browser-warning': 'true',
			},
		})

		if (!response.ok) {
			console.error(`API call failed with status1: ${response.status}`)
		}

		const data = await response.json()

		return data
	} catch (error) {
		console.error('Error get quick check-in data:', error)
		throw error
	}
}

export const saveChatbotMessageApi = async (
	message: { isUserMessage: boolean; message: string },
	token?: string,
) => {
	try {
		const response = await fetch(`${BACKEND_URL}/diaries/ai-chat/message`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` }),
				'ngrok-skip-browser-warning': 'true',
			},
			body: JSON.stringify(message),
		})

		if (!response.ok) {
			console.error(`API call failed with status: ${response.status}`)
		}

		const data = await response.json()

		return data
	} catch (error) {
		console.error('Error get quick check-in data:', error)
		throw error
	}
}

export const resetChatbotConversationApi = async (
	token?: string | undefined,
) => {
	try {
		const response = await fetch(`${BACKEND_URL}/diaries/ai-chat/message`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` }),
				'ngrok-skip-browser-warning': 'true',
			},
		})

		if (!response.ok) {
			console.error(`API call failed with status: ${response.status}`)
		}

		const data = await response.json()

		return data
	} catch (error) {
		console.error('Error get quick check-in data:', error)
		throw error
	}
}
