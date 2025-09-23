import { atom } from 'jotai'

const isAuthenticatedAtom = atom<boolean>(false)

const tokenAtom = atom<string | null>(null)

const isLoadingAtom = atom<boolean>(false)

const userAtom = atom<unknown | null>(null)

export { isAuthenticatedAtom, tokenAtom, isLoadingAtom, userAtom }
