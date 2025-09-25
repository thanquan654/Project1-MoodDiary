import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const tokenAtom = atomWithStorage<string | null>('user_token', null)

const isLoadingAtom = atom<boolean>(false)

const isAuthenticatedAtom = atom((get) => get(tokenAtom) !== null)

const userAtom = atomWithStorage<unknown | null>('user', null)

const logoutAtom = atom(null, (get, set) => {
	set(tokenAtom, null)
	set(userAtom, null)
})

export { isAuthenticatedAtom, tokenAtom, isLoadingAtom, userAtom, logoutAtom }
