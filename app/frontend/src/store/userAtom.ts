import { atom } from 'jotai'

const isAuthenticatedAtom = atom<boolean>(false)

const tokenAtom = atom<string | null>(null)

const isLoadingAtom = atom<boolean>(false)

const userAtom = atom<unknown | null>(null)

const logoutAtom = atom(null, (get, set) => {
	set(isAuthenticatedAtom, false)
	set(tokenAtom, null)
	set(userAtom, null)
})

export { isAuthenticatedAtom, tokenAtom, isLoadingAtom, userAtom, logoutAtom }
