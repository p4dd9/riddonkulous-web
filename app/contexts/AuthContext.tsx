'use client'

import { getCurrentUser, login, logout, User } from '@/app/lib/auth'
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'

interface AuthContextType {
	user: User | null
	isLoading: boolean
	isNativeApp: boolean
	signIn: (idToken: string) => Promise<void>
	signOut: () => Promise<void>
	refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
	children: ReactNode
	initialUser?: User | null
	isNativeApp?: boolean
}

export const AuthProvider = ({ children, initialUser = null, isNativeApp = false }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(initialUser ?? null)
	const [isLoading, setIsLoading] = useState(initialUser === undefined)

	// Only check auth client-side if initialUser was not provided
	// This prevents unnecessary 401 calls when user data is already available from server
	useEffect(() => {
		// If initialUser is explicitly null (not undefined), user was checked server-side
		// Only fetch client-side if initialUser is undefined (not provided)
		if (initialUser === undefined) {
			const checkAuth = async () => {
				try {
					const currentUser = await getCurrentUser()
					setUser(currentUser)
				} catch (error) {
					console.error('Auth check error:', error)
					setUser(null)
				} finally {
					setIsLoading(false)
				}
			}
			checkAuth()
		} else {
			// Initial user was provided (either null or User object)
			setIsLoading(false)
		}
	}, [initialUser])

	const signIn = useCallback(async (idToken: string) => {
		try {
			const response = await login(idToken)
			setUser(response.data.user)
		} catch (error) {
			console.error('Login error:', error)
			setUser(null)
			throw error
		}
	}, [])

	const signOut = useCallback(async () => {
		try {
			await logout()
			setUser(null)
		} catch (error) {
			console.error('Logout error:', error)
			// Still clear user state even if logout fails
			setUser(null)
		}
	}, [])

	const refreshUser = useCallback(async () => {
		const currentUser = await getCurrentUser()
		setUser(currentUser)
	}, [])

	return (
		<AuthContext.Provider value={{ user, isLoading, isNativeApp, signIn, signOut, refreshUser }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
