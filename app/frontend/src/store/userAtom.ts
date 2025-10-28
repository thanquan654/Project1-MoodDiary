// store/userAtom.ts
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const tokenAtom = atomWithStorage<string | null>('user_token', null)

export const isLoadingAtom = atom<boolean>(true)

export const userAtom = atom<{
	avatarUrl: string | null
	email: string
	fullName: string
} | null>(null)

export const isAuthenticatedAtom = atom((get) => !!get(tokenAtom))

export const logoutAtom = atom(null, (_get, set) => {
	set(tokenAtom, null)
	set(userAtom, null)
})
