'use client'

import { getCurrentUser, login, logout, User } from '@/app/lib/auth'
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'

interface AuthContextType {
	user: User | null
	isLoading: boolean
	signIn: (idToken: string) => Promise<void>
	signOut: () => Promise<void>
	refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	// Check if user is already logged in on mount
	useEffect(() => {
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
	}, [])

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
		<AuthContext.Provider value={{ user, isLoading, signIn, signOut, refreshUser }}>
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
